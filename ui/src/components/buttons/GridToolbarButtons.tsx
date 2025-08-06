import { Box } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { DISPLAY_DEPENDING_ON_SIZE } from "../../data/constants";
import { deDE } from '@mui/x-data-grid/locales';

const GridToolbarButtons = () => {
  return (
    <Box sx={{ display: DISPLAY_DEPENDING_ON_SIZE }}>
      <GridToolbarColumnsButton localeText={{ toolbarColumns: "Custom label" }} />
      <GridToolbarFilterButton localeText={{ toolbarColumns: "Custom label" }}  />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </Box>
  );
};

export default GridToolbarButtons;
