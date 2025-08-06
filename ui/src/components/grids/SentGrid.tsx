import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSlots,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
  DATA_GRID_DEFAULT_PAGE_SIZE,
  MAX_SIZE_WHEN_DISPLAY,
} from "../../data/constants";
import { ApprovalStatus } from "../../models/approvalStatus";
import { Tab } from "../../models/tab";
import { IUserFile } from "../../models/userFile";
import { stores } from "../../stores/stores";
import {
  getHumanReadableRelativeDate,
  getHumanReadableRelativeDateIntl,
  getLocaleDateTimeString,
} from "../../utils/helpers";
import GridToolbarButtons from "../buttons/GridToolbarButtons";
import ApprovalRequestDeleteDialog from "../dialogs/ApprovalRequestDeleteDialog";
import ApprovalRequestViewDialog from "../dialogs/ApprovalRequestViewDialog";
import StatusIcon from "../icons/StatusIcon";
import ApproversList from "../lists/ApproversList";
import UserFilesList from "../lists/UserFilesList";
import ApprovalRequestActionsMenu from "../menus/ApprovalRequestActionsMenu";
import NoRowsOverlay from "../overlays/NoRowsOverlay";
import { useTranslation } from "react-i18next";

const SentGrid = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  useEffect(() => {
    stores.commonStore.setCurrentTab(Tab.Sent);
    stores.approvalRequestStore.clearApprovalRequests();
    stores.approvalRequestStore.loadApprovalRequests();
  }, []);

  const customToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarButtons />
      </GridToolbarContainer>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "files",
      headerName: t("SentGrid.SentFilesLabel"),
      flex: 5,
      valueGetter: (_value, row) =>
        row.userFiles.map((userFile: IUserFile) => userFile.name).join(", "),
      renderCell: (params) => {
        return (
          <UserFilesList userFiles={params.row.userFiles} direction="row" />
        );
      },
    },
    {
      field: "status",
      headerName: t("SentGrid.StatusLabel"),
      flex: 1,
      renderCell: (params) => {
        return <StatusIcon status={params.row.status} />;
      },
      valueGetter: (_value, row) => ApprovalStatus[row.status],
    },
    {
      field: "submittedDate",
      headerName: t("SentGrid.SubmittedDateLabel"),
      flex: 3,
      valueFormatter: (value) => getHumanReadableRelativeDateIntl(value),
    },
    {
      field: "approveByDate",
      headerName: t("SentGrid.ApproveByDateLabel"),
      flex: 3,
      valueFormatter: (value) =>
        value && getLocaleDateTimeString(value as Date),
    },
    {
      field: "approvers",
      headerName: t("SentGrid.ApproversLabel"),
      flex: 5,
      valueGetter: (value: string[]) =>
        value.map((approver) => approver.toLowerCase()).join(", "),
      renderCell: (params) => {
        return (
          <ApproversList approvers={params.row.approvers} direction="row" />
        );
      },
    },
    {
      field: "action",
      headerName: t("SentGrid.ActionLabel"),
      headerAlign: "right",
      align: "right",
      flex: 1,
      renderCell: (params) => {
        return <ApprovalRequestActionsMenu approvalRequest={params.row} />;
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <DataGrid
	    localeText={{ toolbarColumns: t("GridToolBar.toolbarColumns"), toolbarFilters: t("GridToolBar.toolbarFilters"), toolbarDensity: t("GridToolBar.toolbarDensity"), toolbarExport: t("GridToolBar.toolbarExport") }}
        rows={stores.approvalRequestStore.approvalRequests}
        columns={columns}
        columnVisibilityModel={{
          submittedDate: useMediaQuery(
            theme.breakpoints.up(MAX_SIZE_WHEN_DISPLAY)
          ),
          approveByDate: useMediaQuery(
            theme.breakpoints.up(MAX_SIZE_WHEN_DISPLAY)
          ),
          approvers: useMediaQuery(theme.breakpoints.up(MAX_SIZE_WHEN_DISPLAY)),
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: DATA_GRID_DEFAULT_PAGE_SIZE,
            },
          },
        }}
        pageSizeOptions={[DATA_GRID_DEFAULT_PAGE_SIZE]}
        disableRowSelectionOnClick
        slots={{
          toolbar: customToolbar,
          noRowsOverlay: NoRowsOverlay,
          loadingOverlay: LinearProgress as GridSlots["loadingOverlay"],
        }}
        sx={{
          "--DataGrid-overlayHeight": "300px",
        }}
        autoHeight
        loading={
          stores.commonStore.isLoading("get_api/request/list") ||
          stores.commonStore.isLoading("delete_api/request")
        }
      />
      <ApprovalRequestViewDialog />
      <ApprovalRequestDeleteDialog />
    </Box>
  );
};

export default observer(SentGrid);
