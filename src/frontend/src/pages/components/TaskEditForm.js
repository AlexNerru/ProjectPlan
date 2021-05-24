import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Paper,
  TextField as MuiTextField,
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  getTasksByProjectAction,
  patchTasksAction,
} from "../../redux/tasks/tasksActions";
import { getParams } from "../../routes/Routes";

const TextField = styled(MuiTextField)(spacing);

export const TaskEditForm = (props) => {
  const { token, isOpen, getTask, closeDialog } = props;

  const dispatch = useDispatch();

  const resources = useSelector((state) => state.resources.resources);

  const task = getTask();

  const handleSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setSubmitting(true);

      dispatch(patchTasksAction(token, task.id, 1, values));

      setTimeout(() => {
        const currentParams = getParams(window.location.href.slice(21));
        dispatch(getTasksByProjectAction(token, currentParams["projectID"]));
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

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit new task please change this form
        </DialogContentText>
        <Formik
          initialValues={{
            name: task !== undefined ? task.name : "Name",
            description:
              task !== undefined ? task.description : "Description of Task",
            planned_work_hours:
              task !== undefined ? task.planned_work_hours : 10,
            planned_start_date:
              task !== undefined ? task.planned_start_date : "2021-05-10",
            planned_finish_date:
              task !== undefined ? task.planned_finish_date : "2021-05-30",
            resource: "",
            submit: false,
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required("Task name is required"),
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
                  error={Boolean(touched.description && errors.description)}
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
                    touched.planned_work_hours && errors.planned_work_hours
                  )}
                  fullWidth
                  helperText={
                    touched.planned_work_hours && errors.planned_work_hours
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
                    touched.planned_start_date && errors.planned_start_date
                  )}
                  fullWidth
                  helperText={
                    touched.planned_start_date && errors.planned_start_date
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
                    touched.planned_finish_date && errors.planned_finish_date
                  )}
                  fullWidth
                  helperText={
                    touched.planned_finish_date && errors.planned_finish_date
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
                  onClick={closeDialog}
                >
                  Change
                </Button>
              </Paper>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
