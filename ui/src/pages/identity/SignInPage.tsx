import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DEFAULT_PATH } from "../../data/constants";
import { Credentials } from "../../models/credentials";
import { stores } from "../../stores/stores";
import { validateEmail } from "../../utils/validators";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";


const SignInPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (!email || !validateEmail(email.toString()) || !password) {
      setEmailError(!email || !validateEmail(email.toString()));
      setPasswordError(!password);
      toast.error(t("pages.identity.SignInPage.ToastInvalidInput"));
    } else {
      const credentials = new Credentials(
        email.toString(),
        password.toString()
      );
      setIsLoading(true);
      if (await stores.userAccountStore.signIn(credentials)) {
        if (location.pathname === "/signIn") {
          navigate(DEFAULT_PATH);
        }
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
            {t("pages.identity.SignInPage.SignInTitle")} 
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("pages.identity.SignInPage.EmailLabel")}
            name="email"
            autoComplete="email"
            autoFocus
            error={emailError}
            helperText={emailError && t("pages.identity.SignInPage.EmailError")}
            onChange={() => setEmailError(false)}
          />
          <FormControl margin="normal" fullWidth variant="outlined" required>
            <InputLabel error={passwordError}>{t("pages.identity.SignInPage.PasswordLabel")}</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t("pages.identity.SignInPage.PasswordVisibilityLabel")}  
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("pages.identity.SignInPage.PasswordLabel")}
              onChange={() => setPasswordError(false)}
            />
            <FormHelperText error id="passwordError">
              {passwordError && t("pages.identity.SignInPage.PasswordError")}
            </FormHelperText>
          </FormControl>
          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            {t("pages.identity.SignInPage.SignInButtonLabel")}
          </LoadingButton>
          <Grid container>
            <Grid item xs={4}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/forgotPassword")}
              >
                {t("pages.identity.SignInPage.ForgotPasswordLabel")} 
              </Link>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/resendConfirmationEmail")}
              >
                {t("pages.identity.SignInPage.ResendConfirmationLabel")} 
              </Link>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "right" }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/signUp")}
              >
                {t("pages.identity.SignInPage.NewRegistrationLabel")} 
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(SignInPage);
