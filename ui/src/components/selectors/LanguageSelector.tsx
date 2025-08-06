import { Menu, Verified } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Link,
  Toolbar,
  Typography,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  Autocomplete,
  ThemeProvider,
  createTheme
} from "@mui/material";

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PATH } from "../../data/constants";
import { stores } from "../../stores/stores";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES,DEFAULT_LANGUAGE } from "../../data/constants";

 
import i18n from "i18next";

const LanguageSelector = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [language, setLanguage] = React.useState(localStorage.getItem('system_language') ?? DEFAULT_LANGUAGE);

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
	localStorage.setItem('system_language', event.target.value);
	i18n.changeLanguage(event.target.value);
  };
  
  return (
     <Box  sx={{ display: { xs: 'none', md: 'flex' } }}>
		<FormControl sx={{ m: 1 }} margin="normal" fullWidth variant="outlined" required>

			<InputLabel  id="demo-simple-select-label">{t("MainAppBar.LanguageLabel")} </InputLabel>
			<Select 
			  labelId="demo-simple-select-label"
			  id="demo-simple-select"
			  value={language}
			  label={t("MainAppBar.LanguageLabel")}
			  onChange={handleChange}
            >
				{LANGUAGES.map(({ code, label }) => (
				  <MenuItem key={code} value={code}>
					{label}
				  </MenuItem>
				))}			
			
		   </Select>
		   
		   
	    </FormControl>

    </Box>
  );
};

export default observer(LanguageSelector);
