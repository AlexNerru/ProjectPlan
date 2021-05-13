import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink, useHistory } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import "react-dragula/dist/dragula.css";

import {
  Avatar,
  Box,
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

import { blue, green, orange, red } from "@material-ui/core/colors";

import { getParams } from "../../routes/Routes";

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
} from "../../redux/actions/projectsActions";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, AvatarGroup } from "@material-ui/lab";
import Cookies from "universal-cookie";
import { MessageCircle } from "react-feather";
import dragula from "react-dragula";
import { getResourcesByProjectAction } from "../../redux/actions/resourcesActions";

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

const TaskWrapper = styled(Card)`
  border: 1px solid ${(props) => props.theme.palette.grey[300]};
  margin-bottom: ${(props) => props.theme.spacing(4)}px;
  cursor: grab;

  &:hover {
    background: ${(props) => props.theme.palette.background.default};
  }
`;

const TaskWrapperContent = styled(CardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;

const TaskAvatars = styled.div`
  margin-left: 8px;
`;

const MessageCircleIcon = styled(MessageCircle)`
  color: ${(props) => props.theme.palette.grey[500]};
  vertical-align: middle;
`;

const TaskBadge = styled.div`
  background: ${(props) => props.color};
  width: 40px;
  height: 6px;
  border-radius: 6px;
  display: inline-block;
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

const TaskNotifications = styled.div`
  display: flex;
  position: absolute;
  bottom: ${(props) => props.theme.spacing(4)}px;
  right: ${(props) => props.theme.spacing(4)}px;
`;

const TaskNotificationsAmount = styled.div`
  color: ${(props) => props.theme.palette.grey[500]};
  font-weight: 600;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  line-height: 1.75;
`;

const TaskTitle = styled(Typography)`
  font-weight: 600;
  font-size: 15px;
  margin-right: ${(props) => props.theme.spacing(10)}px;
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
  const resources = useSelector((state) => state.resources.resources);

  const resourceStatus = useSelector((state) => state.resources.status);
  const authStatus = useSelector((state) => state.auth.status);

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
    const currentParams = getParams(window.location.href.slice(21));

    if (resourceStatus === "idle") {
      dispatch(getResourcesByProjectAction(token, currentParams["projectID"]));
    }
  }, [resourceStatus, dispatch]);

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
        <Button color="primary" variant="contained" fullWidth>
          <AddIcon />
          Add new task
        </Button>
      </CardContent>
    </Card>
  );
}

function Task({ content, avatars }) {
  return (
    <TaskWrapper mb={4}>
      <TaskWrapperContent>
        {content.badges &&
          content.badges.map((color, i) => <TaskBadge color={color} key={i} />)}

        <TaskTitle variant="body1" gutterBottom>
          {content.title}
        </TaskTitle>

        <TaskAvatars>
          <AvatarGroup max={3}>
            {avatars &&
              avatars.map((avatar, i) => (
                <Avatar
                  src={`/static/img/avatars/avatar-${avatar}.jpg`}
                  key={i}
                />
              ))}
          </AvatarGroup>
        </TaskAvatars>

        {content.notifications && (
          <TaskNotifications>
            <TaskNotificationsAmount>
              {content.notifications}
            </TaskNotificationsAmount>
            <MessageCircleIcon />
          </TaskNotifications>
        )}
      </TaskWrapperContent>
    </TaskWrapper>
  );
}

const demoTasks = [
  {
    title: "Redesign the homepage",
    badges: [green[600], orange[600]],
    notifications: 2,
  },
  {
    title: "Upgrade dependencies to latest versions",
    badges: [green[600]],
    notifications: 1,
  },
  {
    title: "Google Adwords best practices",
  },
  {
    title: "Improve site speed",
    badges: [green[600]],
    notifications: 3,
  },
  {
    title: "Stripe payment integration",
    badges: [blue[600]],
  },
];

const containers = [];

function Tasks() {
  const onContainerReady = (container) => {
    containers.push(container);
  };

  useEffect(() => {
    const drake = dragula(containers);
    drake.on("drop", (el, target, source, sibling) => {
      console.log("yep");
    });
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        Tasks
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4} xl={4}>
          <Lane
            title="Backlog"
            description="Nam pretium turpis et arcu. Duis arcu."
            onContainerLoaded={onContainerReady}
          >
            <Task content={demoTasks[0]} avatars={[1, 2, 3, 4]} />
            <Task content={demoTasks[2]} avatars={[2]} />
            <Task content={demoTasks[3]} avatars={[2, 3]} />
            <Task content={demoTasks[1]} avatars={[]} />
            <Task content={demoTasks[4]} avatars={[]} />
          </Lane>
        </Grid>
        <Grid item xs={12} lg={4} xl={4}>
          <Lane
            title="In Progress"
            description="Curabitur ligula sapien, tincidunt non."
            onContainerLoaded={onContainerReady}
          >
            <Task content={demoTasks[2]} avatars={[3, 1, 2]} />
            <Task content={demoTasks[4]} avatars={[2]} />
          </Lane>
        </Grid>
        <Grid item xs={12} lg={4} xl={4}>
          <Lane
            title="Completed"
            description="Aenean posuere, tortor sed cursus feugiat."
            onContainerLoaded={onContainerReady}
          >
            <Task content={demoTasks[3]} avatars={[1, 2]} />
            <Task content={demoTasks[2]} avatars={[4]} />
            <Task content={demoTasks[0]} avatars={[]} />
          </Lane>
        </Grid>
      </Grid>
    </React.Fragment>
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
            Project
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/dashboard">
              Company
            </Link>
            <Link component={NavLink} exact to="/projects">
              Projects
            </Link>
            <Typography>Project</Typography>
          </Breadcrumbs>
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

export default ProjectsList;
