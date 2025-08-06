import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { approvalRequestDelete } from "../../lib/controllers/approvalRequest";
import { stores } from "../../stores/stores";
import { getLocaleDateTimeString } from "../../utils/helpers";
import UserFilesList from "../lists/UserFilesList";
import CommentPaper from "../papers/CommentPaper";
import ApprovalSteps from "../steps/ApprovalSteps";
import { useTranslation } from "react-i18next";

const ApprovalRequestDeleteDialog = () => {
  const { t } = useTranslation();
  
  const handleClose = () => {
    stores.commonStore.setApprovalRequestDeleteDialogIsOpen(false);
  };

  return (
    <Dialog
      open={stores.commonStore.approvalRequestDeleteDialogIsOpen}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          stores.commonStore.setApprovalRequestDeleteDialogIsOpen(false);
          stores.approvalRequestStore.currentApprovalRequest &&
            (await approvalRequestDelete(
              stores.approvalRequestStore.currentApprovalRequest.id
            ));
          stores.approvalRequestStore.clearApprovalRequests();
          stores.approvalRequestStore.loadApprovalRequests();
        },
      }}
    >
      <DialogTitle>{t("ApprovalRequestDeleteDialog.DialogTitle")}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {t("ApprovalRequestDeleteDialog.OnTextLabel")}{" "}
          {getLocaleDateTimeString(
            stores.approvalRequestStore.currentApprovalRequest?.submittedDate
          )}{" "}
          {t("ApprovalRequestDeleteDialog.RequestTextLabel")}
        </DialogContentText>
        <UserFilesList
          userFiles={
            stores.approvalRequestStore.currentApprovalRequest?.userFiles
          }
          direction="column"
          sx={{ my: 1 }}
        />
        {stores.approvalRequestStore.currentApprovalRequest?.approveBy && (
          <DialogContentText>
            {t("ApprovalRequestDeleteDialog.ByTextLabel")}{" "}
            {getLocaleDateTimeString(
              stores.approvalRequestStore.currentApprovalRequest?.approveByDate
            )}
          </DialogContentText>
        )}
        <CommentPaper
          text={stores.approvalRequestStore.currentApprovalRequest?.comment}
          sx={{ my: 1 }}
        />
        <DialogContentText>{t("ApprovalRequestDeleteDialog.FromTextLabel")}</DialogContentText>
        {stores.approvalRequestStore.currentApprovalRequest && (
          <ApprovalSteps
            approvalRequest={stores.approvalRequestStore.currentApprovalRequest}
            sx={{ my: 1 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("ApprovalRequestDeleteDialog.CancelButtonLabel")}</Button>
        <Button type="submit" color="error">
          {t("ApprovalRequestDeleteDialog.DeleteButtonLabel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(ApprovalRequestDeleteDialog);
