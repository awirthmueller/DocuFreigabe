import { HelpOutline, Home, Logout, ManageAccounts } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PATH, UI_BASE_URI } from "../../data/constants";
import { stores } from "../../stores/stores";
import { useTranslation } from "react-i18next";

const UserSettingsDrawer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const listItemIconSx = { minWidth: 35 };

  return (
    <Drawer
      anchor="right"
      open={stores.commonStore.userSettingsDrawerIsOpen}
      onClose={() => stores.commonStore.setUserSettingsDrawerIsOpen(false)}
    >
      <Box
        onClick={() => stores.commonStore.setUserSettingsDrawerIsOpen(false)}
      >
        <List>
          <ListItem key="manageAccount" disablePadding>
            <ListItemButton onClick={() => navigate("/userSettings")}>
              <ListItemIcon sx={listItemIconSx}>
                <ManageAccounts />
              </ListItemIcon>
              <ListItemText
                primary={stores.userAccountStore.currentUser?.email.toLowerCase()}
              />
            </ListItemButton>
          </ListItem>
          <ListItem key="filesAndRequests" disablePadding>
            <ListItemButton onClick={() => navigate(DEFAULT_PATH)}>
              <ListItemIcon sx={listItemIconSx}>
                <Home />
              </ListItemIcon>
              <ListItemText primary={t("UserSettingsDrawer.HomeLabel")} />
            </ListItemButton>
          </ListItem>
          <ListItem key="help" disablePadding>
            <ListItemButton component="a" href={UI_BASE_URI}>
              <ListItemIcon sx={listItemIconSx}>
                <HelpOutline />
              </ListItemIcon>
              <ListItemText primary={t("UserSettingsDrawer.HelpLabel")} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key="signOut" disablePadding>
            <ListItemButton
              onClick={() => {
                stores.userAccountStore.signOut();
                navigate("/");
              }}
            >
              <ListItemIcon sx={listItemIconSx}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary={t("UserSettingsDrawer.LogoutLabel")}/>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default observer(UserSettingsDrawer);
