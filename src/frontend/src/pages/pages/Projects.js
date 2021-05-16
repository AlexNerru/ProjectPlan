import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink, useHistory } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Chip as MuiChip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  IconButton,
  Link,
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
  Tooltip,
  Typography,
} from "@material-ui/core";

import { green, orange, red } from "@material-ui/core/colors";

import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@material-ui/icons";

import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  addProjectsAction,
  deleteProjectsAction,
  getProjectsAction,
} from "../../redux/projects/projectsActions";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert } from "@material-ui/lab";
import Cookies from "universal-cookie";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

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
  { id: "id", alignment: "left", label: "Project ID" },
  { id: "name", alignment: "left", label: "Project" },
  { id: "description", alignment: "left", label: "Description" },
  { id: "owner", alignment: "left", label: "Owner" },
  { id: "actions", alignment: "right", label: "Actions" },
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
            Projects
          </Typography>
        )}
      </ToolbarTitle>
      <Spacer />
      <div>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("project");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const dispatch = useDispatch();
  const history = useHistory();

  const projects = useSelector((state) => state.projects.projects);
  const projectStatus = useSelector((state) => state.projects.status);
  const authStatus = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.projects.error);

  const cookies = new Cookies();

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

  useEffect(() => {
    if (projectStatus === "idle") {
      dispatch(getProjectsAction(token));
    }
  }, [projectStatus, dispatch]);

  const rows = projects;

  const handleProjectDelete = (event, id) => {
    dispatch(deleteProjectsAction(token, id));
  };

  const handleOpenProject = (event, id) => {
    history.push("/projects/" + id + "/");
  };

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
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="left">{row.owner}</TableCell>
                      <TableCell padding="none" align="right">
                        <Box mr={2}>
                          <IconButton
                            aria-label="delete"
                            onClick={(event) =>
                              handleProjectDelete(event, row.id)
                            }
                          >
                            <ArchiveIcon />
                          </IconButton>
                          <IconButton
                            aria-label="details"
                            onClick={(event) =>
                              handleOpenProject(event, row.id)
                            }
                          >
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
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

function ProjectsList() {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const cookies = new Cookies();

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

  const user = useSelector((state) => state.auth.user.id);

  const handleSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setSubmitting(true);
      dispatch(
        addProjectsAction(token, user, {
          name: values.name,
          description: values.description,
        })
      );
      setStatus({ sent: true });
      resetForm();
      setSubmitting(false);
    } catch (error) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Projects" />

      <Grid justify="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Projects
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/dashboard">
              Company
            </Link>
            <Typography>Projects</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              <AddIcon />
              New Project
            </Button>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To create new project please fill this form
                </DialogContentText>
                <Formik
                  initialValues={{
                    name: "Test Project",
                    description: "Test test test",
                    submit: false,
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .max(255)
                      .required("Project name is required"),
                    description: Yup.string()
                      .max(255)
                      .required("Description is required"),
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
                      <TextField
                        name="name"
                        label="Project name"
                        value={values.name}
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        my={2}
                      />
                      <Divider my={6} />
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
                      <Divider my={6} />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={() => setOpen(false)}
                      >
                        Create
                      </Button>
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
        <Grid item xs={12}>
          <EnhancedTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ProjectsList;
