import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { taskComplete } from "../../lib/controllers/approvalRequestTask";
import { ApprovalStatus } from "../../models/approvalStatus";
import { Tab } from "../../models/tab";
import { stores } from "../../stores/stores";
import { getLocaleDateTimeString } from "../../utils/helpers";
import UserFilesList from "../lists/UserFilesList";
import CommentPaper from "../papers/CommentPaper";
import { useTranslation } from "react-i18next";

const UncompletedTaskReviewDialog = () => {
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
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const comment = data.get("comment");
          const decision = data.get("decision");
          if (!decision) {
            setDecisionError(true);
          } else {
            stores.commonStore.setTaskReviewDialogIsOpen(false);
            stores.approvalRequestTaskStore.currentTask &&
              stores.userAccountStore.currentUser &&
              (await taskComplete(
                stores.approvalRequestTaskStore.currentTask.id,
                decision === "approve"
                  ? ApprovalStatus.Approved
                  : ApprovalStatus.Rejected,
                comment?.toString()
              ));
            cleanUp();
            stores.approvalRequestTaskStore.clearTasks();
            stores.approvalRequestTaskStore.loadTasks(Tab.Inbox);
            stores.approvalRequestTaskStore.loadNumberOfUncompletedTasks();
          }
        },
      }}
    >
      <DialogTitle>{t("UncompleteTaskReviewDialog.DialogTitle")}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {stores.approvalRequestTaskStore.currentTask?.approvalRequest.author.toLowerCase()}{" "}
          {t("UncompleteTaskReviewDialog.OnTextLabel")}{" "}
          {getLocaleDateTimeString(
            stores.approvalRequestTaskStore.currentTask?.approvalRequest
              .submittedDate
          )}{" "}
          {t("UncompleteTaskReviewDialog.RequestTextLabel")}
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
            {t("UncompleteTaskReviewDialog.ByTextLabel")}{" "}
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
        <FormControl key="decision" error={decisionError}>
          <RadioGroup
            row
            name="decision"
            onChange={() => setDecisionError(false)}
          >
            <FormControlLabel
              value="approve"
              control={<Radio />}
              label={t("UncompleteTaskReviewDialog.ApproveButtonLabel")}
            />
            <FormControlLabel
              value="reject"
              control={<Radio />}
              label={t("UncompleteTaskReviewDialog.RejectButtonLabel")}
            />
          </RadioGroup>
          {decisionError && (
            <FormHelperText sx={{ mx: 0 }}>
              {t("UncompleteTaskReviewDialog.FormHelperTextLabel")}
            </FormHelperText>
          )}
        </FormControl>
        <TextField
          key="comment"
          id="comment"
          name="comment"
          margin="normal"
          fullWidth
          label={t("UncompleteTaskReviewDialog.CommentTextLabel")} 
          autoFocus
          variant="standard"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button key="Cancel" onClick={handleClose}>
          {t("UncompleteTaskReviewDialog.CancelButtonLabel")}
        </Button>
        <Button key="Submit" type="submit">
          {t("UncompleteTaskReviewDialog.SubmitButtonLabel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(UncompletedTaskReviewDialog);
