import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField as MuiTextField,
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert } from "@material-ui/lab";
import React from "react";
import { patchProjectsAction } from "../../redux/projects/actions";
import { useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";

const TextField = styled(MuiTextField)(spacing);

export const ProjectEditForm = (props) => {
  const { token, isOpen, getProject, closeDialog } = props;

  const dispatch = useDispatch();

  const project = getProject();

  const handleSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setSubmitting(true);

      dispatch(patchProjectsAction(token, project.id, values));

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
      <DialogTitle id="form-dialog-title">Edit project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit project please change this form
        </DialogContentText>
        <Formik
          initialValues={{
            name: project !== undefined ? project.name : "Some project name",
            description:
              project !== undefined
                ? project.description
                : "Some project description",
            submit: false,
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required("Project name is required"),
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
              <Divider my={6} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={closeDialog}
                my={2}
              >
                Change
              </Button>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
