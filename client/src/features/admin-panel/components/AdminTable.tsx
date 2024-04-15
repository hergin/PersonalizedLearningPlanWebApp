import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  useAccountData,
  useRoleUpdater,
} from "../../../hooks/useAdminFeatures";

export default function FullFeaturedCrudGrid() {
  const { data: profiles, isLoading, error } = useAccountData();
  const { mutateAsync: updateRole } = useRoleUpdater();
  const [rows, setRows] = React.useState<GridRowModel[]>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    if (profiles) {
      setRows(profiles);
    }
  }, [profiles]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (GridID: GridRowId, id: number) => async () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.account_id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.account_id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow };
    setRows(
      rows.map((row) =>
        row.account_id === newRow.account_id ? updatedRow : row
      )
    );
    await updateRole({ id: updatedRow.account_id, role: updatedRow.role });
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Columns

  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", width: 180 },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "account_id",
      headerName: "Account ID",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["coach", "basic", "admin"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        const currentRow = rows.find((row) => row.account_id === id);

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id, currentRow?.account_id)}
              key={id}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key={id}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={id}
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "#8C1515",
          color: "white",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          color: "white",
        },
        "& .MuiDataGrid-menuIconButton": {
          color: "white",
        },
        "& .MuiDataGrid-sortIcon": {
          color: "white",
        },
        "& .MuiDataGrid-columnSeparator": {
          visibility: "visible",
          "&:hover": {
            color: "white",
          },
          "&.Mui-resizable": {
            color: "white",
          },
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.account_id}
        loading={isLoading}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        sx={{ backgroundColor: "white" }}
      />
    </Box>
  );
}
