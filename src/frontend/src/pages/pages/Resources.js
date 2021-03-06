import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  IconButton,
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
  TextField as MuiTextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";

import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
} from "@material-ui/icons";

import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  addResourceAction,
  getResourcesAction,
} from "../../redux/resources/resourcesActions";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert } from "@material-ui/lab";
import Cookies from "universal-cookie";
import { ArchiveForm } from "../components/AcrhiveForm";
import WorkHoursChart from "../charts/plotly/WorkHoursChart";
import ResourcesLevelChart from "../charts/plotly/ResourcesLevelChart";
import SkillsChart from "../charts/plotly/SkillsChart";
import {
  getSkillsAction,
  getSkillsLevelAction,
} from "../../redux/charts/actions";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);
const TextField = styled(MuiTextField)(spacing);

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
  { id: "skill_name", alignment: "left", label: "Skill" },
  { id: "skill_level_value", alignment: "left", label: "Level" },
  { id: "actions", alignment: "right", label: "Actions" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
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
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [dialogArchiveOpen, setDialogArchiveOpen] = useState(false);
  const [resourceToArchive, setResourceToArchive] = useState();

  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources.resources);

  const cookies = new Cookies();

  const token = useSelector((state) => {
    if (state.auth.user.token !== undefined) {
      cookies.set("token", state.auth.user.token, { path: "/" });
      return state.auth.user.token;
    } else {
      return cookies.get("token");
    }
  });

  useEffect(() => {
    dispatch(getResourcesAction(token));
  }, []);

  const rows = resources;

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
                      <TableCell align="left">{row.skill_name}</TableCell>
                      <TableCell align="left">
                        {row.skill_level_value}
                      </TableCell>
                      <TableCell padding="none" align="right">
                        <Box mr={2}>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              setResourceToArchive({
                                data: row,
                                type: "resource",
                              });
                              setDialogArchiveOpen(true);
                            }}
                          >
                            <ArchiveIcon />
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
      <ArchiveForm
        token={token}
        isOpen={dialogArchiveOpen}
        getObject={() => resourceToArchive}
        closeDialog={() => setDialogArchiveOpen(false)}
      />
    </div>
  );
}

function ResourcesList() {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const cookies = new Cookies();

  const token = useSelector((state) => {
    if (state.auth.user.token !== undefined) {
      cookies.set("token", state.auth.user.token, { path: "/" });
      return state.auth.user.token;
    } else {
      return cookies.get("token");
    }
  });

  const handleSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setSubmitting(true);
      console.log(values);
      dispatch(
        addResourceAction(token, {
          first_name: values.first_name,
          last_name: values.last_name,
          grade: values.grade,
          rate: values.rate,
          skill_name: values.skill_name,
          skill_level: values.skill_level,
        })
      );

      dispatch(getSkillsLevelAction(token));
      dispatch(getSkillsAction(token));

      setStatus({ sent: true });
      setSubmitting(false);
    } catch (error) {
      setStatus({ sent: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Resources" />

      <Grid justify="space-between" container spacing={10}>
        <Grid item>
          <Typography variant="h3" gutterBottom display="inline">
            Resources
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/dashboard">
              Company
            </Link>
            <Typography>Resources</Typography>
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
              New Resource
            </Button>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Create Resource</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To create new resource please fill this form
                </DialogContentText>
                <Formik
                  initialValues={{
                    first_name: "Test",
                    last_name: "Test Test",
                    grade: 7,
                    rate: 2500,
                    skill_name: "Development",
                    skill_level: "",
                    submit: false,
                  }}
                  validationSchema={Yup.object().shape({
                    first_name: Yup.string()
                      .max(255)
                      .required("First name is required"),
                    last_name: Yup.string()
                      .max(255)
                      .required("Last name is required"),
                    grade: Yup.number().required("Grade is required"),
                    rate: Yup.number().required("Rate is required"),
                    skill_name: Yup.string().required("Skill is required"),
                    skill_level: Yup.string().required(
                      "Skill level is required"
                    ),
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
                        name="first_name"
                        label="First name"
                        value={values.first_name}
                        error={Boolean(touched.first_name && errors.first_name)}
                        fullWidth
                        helperText={touched.first_name && errors.first_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        my={2}
                      />
                      <TextField
                        name="last_name"
                        label="Last name"
                        value={values.last_name}
                        error={Boolean(touched.last_name && errors.last_name)}
                        fullWidth
                        helperText={touched.last_name && errors.last_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        my={2}
                      />
                      <TextField
                        name="grade"
                        label="Grade"
                        value={values.grade}
                        error={Boolean(touched.grade && errors.grade)}
                        fullWidth
                        helperText={touched.grade && errors.grade}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        my={2}
                      />
                      <TextField
                        name="rate"
                        label="Rate"
                        value={values.rate}
                        error={Boolean(touched.rate && errors.rate)}
                        fullWidth
                        helperText={touched.rate && errors.rate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        my={2}
                      />
                      <TextField
                        name="skill_name"
                        label="Skill"
                        value={values.skill_name}
                        error={Boolean(touched.skill_name && errors.skill_name)}
                        fullWidth
                        helperText={touched.skill_name && errors.skill_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        my={2}
                      />
                      <TextField
                        name="skill_level"
                        select
                        label="Skill level"
                        value={values.skill_level}
                        error={Boolean(
                          touched.skill_level && errors.skill_level
                        )}
                        fullWidth
                        helperText={touched.skill_level && errors.skill_level}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        my={2}
                        defaultValue={"MI"}
                      >
                        <MenuItem value="JR">Junior</MenuItem>
                        <MenuItem value="MI">Middle</MenuItem>
                        <MenuItem value="SE">Senior</MenuItem>
                      </TextField>
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

      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <ResourcesLevelChart token={token} />
        </Grid>

        <Grid item xs={12} lg={6}>
          <SkillsChart token={token} />
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

export default ResourcesList;
