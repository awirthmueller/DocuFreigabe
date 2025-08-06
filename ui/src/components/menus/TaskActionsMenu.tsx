import { MoreHoriz } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import {
  MENU_ANCHOR_ORIGIN,
  MENU_SLOT_PROPS,
  MENU_TRANSFORM_ORIGIN,
} from "../../data/constants";
import { IApprovalRequestTask } from "../../models/approvalRequestTask";
import { stores } from "../../stores/stores";
import { useTranslation } from "react-i18next";

interface ITaskActionsMenuProps {
  task: IApprovalRequestTask;
}

const TaskActionsMenu: React.FC<ITaskActionsMenuProps> = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleReview = () => {
    stores.approvalRequestTaskStore.setCurrentTask(task);
    stores.commonStore.setTaskReviewDialogIsOpen(true);
    handleClose();
  };
  const { t } = useTranslation();
  
  return (
    <Box>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreHoriz />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={MENU_ANCHOR_ORIGIN}
        transformOrigin={MENU_TRANSFORM_ORIGIN}
        slotProps={MENU_SLOT_PROPS}
      >
        <MenuItem onClick={handleReview}>{t("TaskActionsMenu.ReviewLabel")}</MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskActionsMenu;
