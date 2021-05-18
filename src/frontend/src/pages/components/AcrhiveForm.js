import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper as MuiPaper,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { deleteProjectsAction } from "../../redux/projects/actions";
import { useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert } from "@material-ui/lab";
import { deleteResourcesAction } from "../../redux/resources/resourcesActions";

const Paper = styled(MuiPaper)(spacing);

export const ArchiveForm = (props) => {
  const { token, isOpen, getObject, closeDialog } = props;
  const [obj, setObj] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      setObj(getObject());
    }
  }, [isOpen]);

  const archiveType = obj !== undefined ? obj.type : "";

  const handleSubmit = (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setSubmitting(true);
      if (archiveType === "project") {
        dispatch(deleteProjectsAction(token, obj.data.id));
      }

      if (archiveType === "resource") {
        dispatch(deleteResourcesAction(token, obj.data.id));
      }

      setStatus({ sent: true });
      resetForm();
      setSubmitting(false);
      closeDialog();
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
      <DialogTitle id="form-dialog-title">Archive {archiveType}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please confirm {archiveType} archive
        </DialogContentText>
        <Formik initialValues={{}} onSubmit={handleSubmit}>
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

              <Grid>
                <Paper my={3}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Archive
                  </Button>
                </Paper>
                <Paper my={3}>
                  <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={closeDialog}
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
  );
};
