import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { stores } from "../../stores/stores";
import { validateEmail } from "../../utils/validators";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

const ResendConfirmationEmailPage = () => {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    if (!email || !validateEmail(email.toString())) {
      setEmailError(!email || !validateEmail(email.toString()));
      toast.error(t("pages.identity.ResendConfirmationEmailPage.ToastInvalidInput"));
    } else {
      setIsLoading(true);
      if (
        await stores.userAccountStore.resendConfirmationEmail(email.toString())
      ) {
        navigate("/information", {
          state: {
            message:
               t("pages.identity.ResendConfirmationEmailPage.LinkSent"),
          },
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {t("pages.identity.ResendConfirmationEmailPage.PageTitle")} 
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("pages.identity.ResendConfirmationEmailPage.EmailLabel")} 
            name="email"
            autoComplete="email"
            autoFocus
            error={emailError}
            helperText={emailError && t("pages.identity.ResendConfirmationEmailPage.EmailError")}
            onChange={() => setEmailError(false)}
          />
          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            {t("pages.identity.ResendConfirmationEmailPage.SendLabel")}
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/signIn")}
              >
                 {t("pages.identity.ResendConfirmationEmailPage.SignInButtonLabel")}
              </Link>
            </Grid>
            <Grid item>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/signUp")}
              >
                {t("pages.identity.ResendConfirmationEmailPage.NewRegistrationLabel")}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(ResendConfirmationEmailPage);
