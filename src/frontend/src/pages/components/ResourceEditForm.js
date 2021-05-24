import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MenuItem,
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
import { patchResourceAction } from "../../redux/resources/resourcesActions";

const TextField = styled(MuiTextField)(spacing);

export const ResourceEditForm = (props) => {
  const { token, isOpen, getResource, closeDialog } = props;

  const dispatch = useDispatch();

  const resource = getResource();

  const handleSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setSubmitting(true);

      console.log(values);

      dispatch(patchResourceAction(token, resource.id, values));

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
      <DialogTitle id="form-dialog-title">Edit resource</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To change resource please change this form
        </DialogContentText>
        <Formik
          initialValues={{
            first_name:
              resource !== undefined ? resource.first_name : "First name",
            last_name:
              resource !== undefined ? resource.last_name : "Last name",
            grade: resource !== undefined ? resource.grade : 7,
            rate: resource !== undefined ? resource.rate : 800,
            skill_name:
              resource !== undefined ? resource.skill_name : "Development",
            skill_level: resource !== undefined ? resource.skill_level : "",
            submit: false,
          }}
          validationSchema={Yup.object().shape({
            first_name: Yup.string()
              .max(255)
              .required("First name is required"),
            last_name: Yup.string().max(255).required("Last name is required"),
            grade: Yup.number().required("Grade is required"),
            rate: Yup.number().required("Rate is required"),
            skill_name: Yup.string().required("Skill is required"),
            skill_level: Yup.string().required("Skill level is required"),
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
                error={Boolean(touched.skill_level && errors.skill_level)}
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
                onClick={closeDialog}
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
