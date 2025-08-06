import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { stores } from "../../stores/stores";
import { getLocaleDateTimeString } from "../../utils/helpers";
import UserFilesList from "../lists/UserFilesList";
import CommentPaper from "../papers/CommentPaper";
import ApprovalSteps from "../steps/ApprovalSteps";
import { useTranslation } from "react-i18next";

const ApprovalRequestViewDialog = () => {
  const { t } = useTranslation();
  const handleClose = () => {
    stores.commonStore.setApprovalRequestViewDialogIsOpen(false);
    stores.approvalRequestStore.setCurrentApprovalRequest(null);
  };

  return (
    <Dialog
      open={stores.commonStore.approvalRequestViewDialogIsOpen}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>{t("ApprovalRequestViewDialog.DialogTitle")}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {t("ApprovalRequestViewDialog.OnTextLabel")}{" "}
          {getLocaleDateTimeString(
            stores.approvalRequestStore.currentApprovalRequest?.submittedDate
          )}{" "}
          {t("ApprovalRequestViewDialog.RequestTextLabel")}
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
            {t("ApprovalRequestViewDialog.ByTextLabel")}{" "}
            {getLocaleDateTimeString(
              stores.approvalRequestStore.currentApprovalRequest?.approveByDate
            )}
          </DialogContentText>
        )}
        <CommentPaper
          text={stores.approvalRequestStore.currentApprovalRequest?.comment}
          sx={{ my: 1 }}
        />
        <DialogContentText> {t("ApprovalRequestViewDialog.FromTextLabel")}</DialogContentText>
        {stores.approvalRequestStore.currentApprovalRequest && (
          <ApprovalSteps
            approvalRequest={stores.approvalRequestStore.currentApprovalRequest}
            sx={{ my: 1 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("ApprovalRequestViewDialog.CloseButtonLabel")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(ApprovalRequestViewDialog);
