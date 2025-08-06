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
import { Tab } from "../../models/tab";
import { IUserFile } from "../../models/userFile";
import { stores } from "../../stores/stores";
import {
  getHumanReadableRelativeDate,
  getHumanReadableRelativeDateIntl,
  getLocaleDateTimeString,
} from "../../utils/helpers";
import GridToolbarButtons from "../buttons/GridToolbarButtons";
import UncompletedTaskReviewDialog from "../dialogs/UncompletedTaskReviewDialog";
import UserFilesList from "../lists/UserFilesList";
import TaskActionsMenu from "../menus/TaskActionsMenu";
import NoRowsOverlay from "../overlays/NoRowsOverlay";
import { useTranslation } from "react-i18next";

const InboxGrid = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  useEffect(() => {
    stores.commonStore.setCurrentTab(Tab.Inbox);
    stores.approvalRequestTaskStore.clearTasks();
    stores.approvalRequestTaskStore.loadTasks(Tab.Inbox);
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
      headerName: t("InboxGrid.FilesLabel"),
      flex: 5,
      valueGetter: (_value, row) =>
        row.approvalRequest.userFiles
          .map((userFile: IUserFile) => userFile.name)
          .join(", "),
      renderCell: (params) => {
        return (
          <UserFilesList
            userFiles={params.row.approvalRequest.userFiles}
            direction="row"
          />
        );
      },
    },
    {
      field: "received",
      headerName: t("InboxGrid.ReceivedLabel"),
      flex: 3,
      valueGetter: (_value, row) =>
        getHumanReadableRelativeDateIntl(row.approvalRequest.submittedDate),
    },
    {
      field: "reviewBy",
      headerName: t("InboxGrid.ReviewByLabel"),
      flex: 3,
      valueGetter: (_value, row) =>
        row.approvalRequest.approveByDate
          ? getLocaleDateTimeString(row.approvalRequest.approveByDate as Date)
          : null,
    },
    {
      field: "requester",
      headerName: t("InboxGrid.RequesterLabel"),
      flex: 5,
      valueGetter: (_value, row) =>
        (row.approvalRequest.author as string).toLowerCase(),
    },
    {
      field: "action",
      headerName: t("InboxGrid.ActionLabel"),
      headerAlign: "right",
      align: "right",
      flex: 1,
      renderCell: (params) => {
        return <TaskActionsMenu task={params.row} />;
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <DataGrid
	    localeText={{ toolbarColumns: t("GridToolBar.toolbarColumns"), toolbarFilters: t("GridToolBar.toolbarFilters"), toolbarDensity: t("GridToolBar.toolbarDensity"), toolbarExport: t("GridToolBar.toolbarExport") }}
        rows={stores.approvalRequestTaskStore.tasks}
        columns={columns}
        columnVisibilityModel={{
          received: useMediaQuery(theme.breakpoints.up(MAX_SIZE_WHEN_DISPLAY)),
          reviewBy: useMediaQuery(theme.breakpoints.up(MAX_SIZE_WHEN_DISPLAY)),
          requester: useMediaQuery(theme.breakpoints.up(MAX_SIZE_WHEN_DISPLAY)),
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
          stores.commonStore.isLoading("get_api/task/listUncompleted") ||
          stores.commonStore.isLoading("post_api/task/complete")
        }
      />
      <UncompletedTaskReviewDialog />
    </Box>
  );
};

export default observer(InboxGrid);
