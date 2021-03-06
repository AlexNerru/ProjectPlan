import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import "react-dragula/dist/dragula.css";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { Task } from "../components/Task";

import { getParams } from "../../routes/Routes";

import { Add as AddIcon } from "@material-ui/icons";

import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert } from "@material-ui/lab";
import Cookies from "universal-cookie";
import dragula from "react-dragula";

import {
  getResourcesAction,
  getResourcesByProjectAction,
} from "../../redux/resources/resourcesActions";

import {
  addTaskAction,
  getTasksByProjectAction,
  patchTasksAction,
} from "../../redux/tasks/tasksActions";

import { getCostsAction, getWorkHoursAction } from "../../redux/charts/actions";

import WorkHoursChart from "../charts/plotly/WorkHoursChart";
import CostsChart from "../charts/plotly/CostsChart";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const ToolbarTitle = styled.div`
  min-width: 150px;
`;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "id", alignment: "left", label: "Resource ID" },
  { id: "first_name", alignment: "left", label: "First Name" },
  { id: "last_name", alignment: "left", label: "Last Name" },
  { id: "grade", alignment: "left", label: "Grade" },
  { id: "rate", alignment: "left", label: "Rate" },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignment}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

let EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar>
      <ToolbarTitle>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Resources
          </Typography>
        )}
      </ToolbarTitle>
      <Spacer />
    </Toolbar>
  );
};

function EnhancedTable() {
  const cookies = new Cookies();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("project");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const dispatch = useDispatch();
  const project_resources = useSelector(
    (state) => state.resources.project_resources
  );
  const resourceStatus = useSelector((state) => state.resources.status);
  const token = useSelector((state) => {
    if (state.auth.user.token !== undefined) {
      cookies.set("token", state.auth.user.token, { path: "/" });
      return state.auth.user.token;
    } else {
      return cookies.get("token");
    }
  });

  useEffect(() => {
    const currentParams = getParams(window.location.href.slice(21));

    if (resourceStatus === "idle") {
      dispatch(getResourcesByProjectAction(token, currentParams["projectID"]));
    }
  }, [resourceStatus, dispatch]);

  const rows = project_resources;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div>
      <Paper>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`${row.id}-${index}`}
                    >
                      <TableCell align="left">#{row.id}</TableCell>
                      <TableCell align="left">{row.first_name}</TableCell>
                      <TableCell align="left">{row.last_name}</TableCell>
                      <TableCell align="left">{row.grade}</TableCell>
                      <TableCell align="left">{row.rate}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

function Lane({ title, description, onContainerLoaded, children }) {
  const handleContainerLoaded = (container) => {
    if (container) {
      onContainerLoaded(container);
    }
  };

  return (
    <Card mb={6}>
      <CardContent pb={0}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" mb={4}>
          {description}
        </Typography>
        <div ref={handleContainerLoaded}>{children}</div>
      </CardContent>
    </Card>
  );
}

const containers = [];

function Tasks() {
  const cookies = new Cookies();

  const [sourceOnDrop, setSource] = React.useState();
  const [elOnDrop, setEl] = React.useState();
  const [projectID, setProjectID] = useState();

  const [open, setOpen] = React.useState(false);
  const [openFinishTask, setFinishTaskOpen] = React.useState(false);

  const onContainerReady = (container) => {
    containers.push(container);
  };

  useEffect(() => {
    const currentParams = getParams(window.location.href.slice(21));
    setProjectID(currentParams["projectID"]);
    dispatch(getTasksByProjectAction(token, currentParams["projectID"]));
  }, []);

  useEffect(() => {
    const drake = dragula(containers, {
      accepts: function (el, target, source, sibling) {
        const target_div = target.parentElement.parentElement.parentElement.id;
        const source_div = source.parentElement.parentElement.parentElement.id;
        if (target_div === "progress_div" && source_div === "todo_div") {
          return true;
        }
        return target_div === "done_div" && source_div === "progress_div";
      },
      moves: function (el, source, handle, sibling) {
        return el.id !== "not_movable";
      },
    });
    drake.on("drop", (el, target, source, sibling) => {
      const target_div = target.parentElement.parentElement.parentElement.id;
      const source_div = source.parentElement.parentElement.parentElement.id;
      if (target_div === "done_div" && source_div === "progress_div") {
        setFinishTaskOpen(true);
        setSource(source);
        setEl(el);
      }
      if (target_div === "progress_div" && source_div === "todo_div") {
        handleSwitchToProgress(source, el);
      }
    });
  }, []);

  useEffect(() => {
    const currentParams = getParams(window.location.href.slice(21));

    if (resourceStatus === "idle") {
      dispatch(getResourcesByProjectAction(token, currentParams["projectID"]));
    }
  }, []);

  useEffect(() => {
    if (resourceStatus === "idle") {
      dispatch(getResourcesAction(token));
    }
  }, []);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.project_tasks);
  const token = useSelector((state) => {
    if (state.auth.user.token !== undefined) {
      cookies.set("token", state.auth.user.token, { path: "/" });
      return state.auth.user.token;
    } else {
      return cookies.get("token");
    }
  });
  const id = useSelector((state) => {
    if (state.auth.user.id !== undefined) {
      cookies.set("id", state.auth.user.id, { path: "/" });
      return state.auth.user.id;
    } else {
      return cookies.get("id");
    }
  });
  const resources = useSelector((state) => state.resources.resources);
  const resourceStatus = useSelector((state) => state.resources.status);

  const handleSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setOpen(false);
      setSubmitting(true);

      dispatch(addTaskAction(token, id, projectID, values));

      //TODO: ????????????????, ?????? ???????????? ?? ????????????????
      setTimeout(() => {
        dispatch(getResourcesByProjectAction(token, projectID));
      }, 500);

      setTimeout(() => {
        dispatch(getWorkHoursAction(token, projectID));
      }, 500);

      setTimeout(() => {
        dispatch(getCostsAction(token, projectID));
      }, 500);

      setStatus({ sent: true });
      resetForm();
      setSubmitting(false);
    } catch (error) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  const handleFinishTaskSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setFinishTaskOpen(false);
      setSubmitting(true);

      const taskId = elOnDrop.childNodes[0].childNodes[0].childNodes[1].data;

      dispatch(patchTasksAction(token, taskId, 3, values));

      setTimeout(() => {
        dispatch(getWorkHoursAction(token, projectID));
      }, 500);

      setTimeout(() => {
        dispatch(getCostsAction(token, projectID));
      }, 500);

      setStatus({ sent: true });
      resetForm();
      setSubmitting(false);
    } catch (error) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  const handleSwitchToProgress = (source, el) => {
    const taskId = el.childNodes[0].childNodes[0].childNodes[1].data;

    dispatch(
      patchTasksAction(token, taskId, 2, {
        fact_start_date: new Date().toISOString().split("T")[0],
      })
    );
  };

  const handleCancel = () => {
    sourceOnDrop.appendChild(elOnDrop);
    setFinishTaskOpen(false);
  };

  return (
    <React.Fragment>
      <Grid justify="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Tasks
          </Typography>
        </Grid>
        <Grid item>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              <AddIcon />
              New task
            </Button>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Create Task</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To create new task please fill this form
                </DialogContentText>
                <Formik
                  initialValues={{
                    name: "Task Name",
                    description: "Description of Task",
                    planned_work_hours: 10,
                    planned_start_date: "2021-05-10",
                    planned_finish_date: "2021-05-30",
                    resource: "",
                    submit: false,
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .max(255)
                      .required("Task name is required"),
                    description: Yup.string()
                      .max(2000)
                      .required("Description is required"),
                    planned_work_hours: Yup.number()
                      .min(1, "Task cat last at least one hour")
                      .required("Planned work is required"),
                    planned_start_date: Yup.date()
                      .min(new Date(), "Min date is today")
                      .required("Planned start date is required"),
                    planned_finish_date: Yup.date()
                      .min(new Date(), "Min date is today")
                      .required("Planned finish date is required"),
                    resource: Yup.number()
                      .min(1, "Please select employee")
                      .required("Employee is required"),
                  })}
                  onSubmit={handleSubmit}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      {errors.submit && (
                        <Alert mt={2} mb={1} severity="warning">
                          {errors.submit}
                        </Alert>
                      )}
                      <Paper mt={3}>
                        <TextField
                          name="name"
                          label="Task name"
                          value={values.name}
                          error={Boolean(touched.name && errors.name)}
                          fullWidth
                          helperText={touched.name && errors.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          my={2}
                        />
                      </Paper>
                      <Paper mt={3}>
                        <TextField
                          name="description"
                          label="Description"
                          value={values.description}
                          error={Boolean(
                            touched.description && errors.description
                          )}
                          fullWidth
                          helperText={touched.description && errors.description}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          my={2}
                        />
                      </Paper>
                      <Paper mt={3}>
                        <TextField
                          name="planned_work_hours"
                          label="Work hours estimation"
                          value={values.planned_work_hours}
                          error={Boolean(
                            touched.planned_work_hours &&
                              errors.planned_work_hours
                          )}
                          fullWidth
                          helperText={
                            touched.planned_work_hours &&
                            errors.planned_work_hours
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          my={2}
                        />
                      </Paper>
                      <Paper mt={2}>
                        <TextField
                          name="resource"
                          select
                          multiple
                          label="Employee"
                          value={values.resource}
                          error={Boolean(touched.resource && errors.resource)}
                          fullWidth
                          helperText={touched.resource && errors.resource}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          my={2}
                          defaultValue={"DEFAULT"}
                        >
                          <MenuItem value="DEFAULT" disabled>
                            Choose a employee
                          </MenuItem>
                          {resources.map((resource, index) => {
                            return (
                              <MenuItem key={resource.id} value={resource.id}>
                                {resource.first_name + " " + resource.last_name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </Paper>
                      <Paper mt={3}>
                        <TextField
                          name="planned_start_date"
                          label="Start date"
                          type="date"
                          value={values.planned_start_date}
                          error={Boolean(
                            touched.planned_start_date &&
                              errors.planned_start_date
                          )}
                          fullWidth
                          helperText={
                            touched.planned_start_date &&
                            errors.planned_start_date
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Paper>
                      <Paper mt={3}>
                        <TextField
                          name="planned_finish_date"
                          label="Finish date"
                          type="date"
                          value={values.planned_finish_date}
                          error={Boolean(
                            touched.planned_finish_date &&
                              errors.planned_finish_date
                          )}
                          fullWidth
                          helperText={
                            touched.planned_finish_date &&
                            errors.planned_finish_date
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Paper>
                      <Paper mt={3}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          Create
                        </Button>
                      </Paper>
                    </form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4} xl={4}>
          <div id={"todo_div"}>
            <Lane
              id="todo_lane"
              title="To do"
              description="Task that we need to do"
              onContainerLoaded={onContainerReady}
            >
              <div id={"not_movable"}>
                <Task
                  content={{
                    name: "",
                    description: "",
                  }}
                  topTask={true}
                />
              </div>
              {tasks
                .filter(function (task) {
                  return task.status === 1;
                })
                .map((task, index) => {
                  return <Task key={task.id} content={task} />;
                })}
            </Lane>
          </div>
        </Grid>
        <Grid item xs={12} lg={4} xl={4}>
          <div id={"progress_div"}>
            <Lane
              id="progress_lane"
              title="In Progress"
              description="Tasks that we are doing"
              onContainerLoaded={onContainerReady}
            >
              <div id={"not_movable"}>
                <Task
                  content={{
                    name: "",
                    description: "",
                  }}
                  topTask={true}
                />
              </div>
              {tasks
                .filter(function (task) {
                  return task.status === 2;
                })
                .map((task, index) => {
                  return <Task key={task.id} content={task} />;
                })}
            </Lane>
          </div>
        </Grid>
        <Grid item xs={12} lg={4} xl={4}>
          <div id={"done_div"}>
            <Lane
              id="done_lane"
              title="Completed"
              description="Tasks that we have done"
              onContainerLoaded={onContainerReady}
            >
              <div id={"not_movable"}>
                <Task
                  content={{
                    name: "",
                    description: "",
                  }}
                  topTask={true}
                />
              </div>
              {tasks
                .filter(function (task) {
                  return task.status === 3;
                })
                .map((task, index) => {
                  return <Task key={task.id} content={task} />;
                })}
            </Lane>
          </div>
        </Grid>
      </Grid>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openFinishTask}
        onClose={() => setFinishTaskOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Close Task</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              fact_work_hours: 10,
              fact_finish_date: "2021-05-30",
              submit: false,
            }}
            validationSchema={Yup.object().shape({
              fact_work_hours: Yup.number()
                .min(1, "Task cat last at least one hour")
                .required("Fact work is required"),
              fact_finish_date: Yup.date()
                .min(new Date(new Date().getDate() - 1), "Min date is today")
                .required("Fact finish date is required"),
            })}
            onSubmit={handleFinishTaskSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form noValidate onSubmit={handleSubmit}>
                {errors.submit && (
                  <Alert mt={2} mb={1} severity="warning">
                    {errors.submit}
                  </Alert>
                )}
                <Paper mt={3}>
                  <TextField
                    name="fact_work_hours"
                    label="Fact work hours estimation"
                    value={values.fact_work_hours}
                    error={Boolean(
                      touched.fact_work_hours && errors.fact_work_hours
                    )}
                    fullWidth
                    helperText={
                      touched.fact_work_hours && errors.fact_work_hours
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />
                </Paper>
                <Paper mt={3}>
                  <TextField
                    name="fact_finish_date"
                    label="Finish date"
                    type="date"
                    value={values.fact_finish_date}
                    error={Boolean(
                      touched.fact_finish_date && errors.fact_finish_date
                    )}
                    fullWidth
                    helperText={
                      touched.fact_finish_date && errors.fact_finish_date
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Paper>
                <Grid>
                  <Paper mt={3}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Finish
                    </Button>
                  </Paper>
                  <Paper mt={3}>
                    <Button
                      type="button"
                      fullWidth
                      variant="outlined"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Paper>
                </Grid>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

function Project() {
  const cookies = new Cookies();

  const [projectID, setProjectID] = useState();

  const token = useSelector((state) => {
    if (state.auth.user.token !== undefined) {
      cookies.set("token", state.auth.user.token, { path: "/" });
      return state.auth.user.token;
    } else {
      return cookies.get("token");
    }
  });

  useEffect(() => {
    //TODO: remove this slice 21
    const currentParams = getParams(window.location.href.slice(21));
    setProjectID(currentParams["projectID"]);
  }, []);

  return (
    <React.Fragment>
      <Helmet title="Projects" />

      <Grid justify="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Project
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/dashboard">
              Company
            </Link>
            <Link component={NavLink} exact to="/projects">
              Projects
            </Link>
            <Typography>Project {projectID}</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={12}>
          <WorkHoursChart token={token} projectID={projectID} />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={12}>
          <CostsChart token={token} projectID={projectID} />
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <EnhancedTable />
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Tasks />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Project;
