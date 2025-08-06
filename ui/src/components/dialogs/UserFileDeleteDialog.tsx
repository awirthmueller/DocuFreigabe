import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { fileDelete } from "../../lib/controllers/userFile";
import { stores } from "../../stores/stores";
import UserFilesList from "../lists/UserFilesList";
import { useTranslation } from "react-i18next";

const UserFileDeleteDialog = () => {
  const { t } = useTranslation();
  const handleClose = () => {
    stores.commonStore.setUserFileDeleteDialogIsOpen(false);
  };

  return (
    <Dialog
      open={stores.commonStore.userFileDeleteDialogIsOpen}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          stores.commonStore.setUserFileDeleteDialogIsOpen(false);
          stores.userFileStore.currentUserFile &&
            (await fileDelete(stores.userFileStore.currentUserFile.id));
          stores.userFileStore.clearUserFiles();
          stores.userFileStore.loadUserFiles();
        },
      }}
    >
      <DialogTitle>Delete file</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
			{t("UserFileDeleteDialog.DialogContentText")}
        </DialogContentText>
        {stores.userFileStore.currentUserFile && (
          <UserFilesList
            userFiles={[stores.userFileStore.currentUserFile]}
            direction="column"
            sx={{ my: 1 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("UserFileDeleteDialog.CancelButtonLabel")}</Button>
        <Button type="submit" color="error">
          {t("UserFileDeleteDialog.DeleteButtonLabel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(UserFileDeleteDialog);
