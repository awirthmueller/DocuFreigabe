import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ApprovalStatus } from "../../models/approvalStatus";
import { stores } from "../../stores/stores";
import { getLocaleDateTimeString } from "../../utils/helpers";
import UserFilesList from "../lists/UserFilesList";
import CommentPaper from "../papers/CommentPaper";
import { useTranslation } from "react-i18next";

const CompletedTaskViewDialog = () => {
  const [decisionError, setDecisionError] = useState(false);
  const { t } = useTranslation();
  
  const cleanUp = () => {
    setDecisionError(false);
  };

  const handleClose = () => {
    stores.commonStore.setTaskReviewDialogIsOpen(false);
    cleanUp();
  };

  return (
    <Dialog
      open={stores.commonStore.taskReviewDialogIsOpen}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>{t("CompleteTaskReviewDialog.DialogTitle")}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {stores.approvalRequestTaskStore.currentTask?.approvalRequest.author.toLowerCase()}{" "}
          {t("CompleteTaskReviewDialog.OnTextLabel")}{" "}
          {getLocaleDateTimeString(
            stores.approvalRequestTaskStore.currentTask?.approvalRequest
              .submittedDate
          )}{" "}
          {t("CompleteTaskReviewDialog.RequestTextLabel")}
        </DialogContentText>

        <UserFilesList
          userFiles={
            stores.approvalRequestTaskStore.currentTask?.approvalRequest
              .userFiles
          }
          direction="column"
          sx={{ my: 1 }}
        />
        {stores.approvalRequestTaskStore.currentTask?.approvalRequest
          .approveBy && (
          <DialogContentText>
            {t("CompleteTaskReviewDialog.ByTextLabel")}{" "}
            {getLocaleDateTimeString(
              stores.approvalRequestTaskStore.currentTask?.approvalRequest
                .approveByDate
            )}
          </DialogContentText>
        )}
        <CommentPaper
          text={
            stores.approvalRequestTaskStore.currentTask?.approvalRequest.comment
          }
          sx={{ my: 1 }}
        />
        <DialogContentText>
          {t("CompleteTaskReviewDialog.OnTextLabel2")}{" "}
          {getLocaleDateTimeString(
            stores.approvalRequestTaskStore.currentTask?.completedDate
          )}{" "}
          {t("CompleteTaskReviewDialog.YouTextLabel")} 
        </DialogContentText>
        <FormControl key="decision" error={decisionError}>
          <RadioGroup
            row
            name="decision"
            value={
              stores.approvalRequestTaskStore.currentTask?.status ===
              ApprovalStatus.Approved
                ? "approved"
                : "rejected"
            }
          >
            <FormControlLabel
              value="approved"
              control={<Radio />}
              label={t("CompleteTaskReviewDialog.ApproveButtonLabel")}
              disabled
            />
            <FormControlLabel
              value="rejected"
              control={<Radio />}
              label={t("CompleteTaskReviewDialog.RejectButtonLabel")}
              disabled
            />
          </RadioGroup>
        </FormControl>
        <CommentPaper
          text={stores.approvalRequestTaskStore.currentTask?.comment}
          sx={{ my: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button key="Cancel" onClick={handleClose}>
          {t("CompleteTaskReviewDialog.CancelButtonLabel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(CompletedTaskViewDialog);
