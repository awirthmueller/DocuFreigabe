import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import { stores } from "../../stores/stores";
import { useTranslation } from "react-i18next";

const SendButton = () => {
  const { t } = useTranslation();
  
  return (
    <Button
      size="small"
      variant="text"
      startIcon={<Send />}
      onClick={() =>
        stores.commonStore.setApprovalRequestSubmitDialogIsOpen(true)
      }
      disabled={
        stores.userFileStore.getSelectedUserFiles().length > 0 ? false : true
      }
    >
      {t("SendButton.SendButtonLabel")}
    </Button>
  );
};

export default observer(SendButton);
