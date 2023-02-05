import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import axios from 'axios';
// @mui
import {
  Grid,
  TextField,
  TableRow,
  TableCell,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import { api } from '../../constants';
// ----------------------------------------------------------------------

SkillLevelTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onEditRowError: PropTypes.func,
};

export default function SkillLevelTableRow({ row, selected, onEditRow, onEditRowError }) {
  // const { id, name } = row;
  const { control, reset } = useForm({
    defaultValues: {
      id: '',
      name: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleAdd = () => {
    append({
      name: '',
    });
  };

  const handleRemove = (index) => {
    listskilAdd.splice(index, 1);
    remove(index);
    // console.log(listskilAdd);
  };
  const [refreshData, setRefreshData] = useState(false);
  const [listskilGroup, setlistskilGroup] = useState([]);
  const [listskilGroup1, setlistskilGroup1] = useState([]);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [listskilAdd, setlistskilAdd] = useState([]);
  const [listskilRemove, setlistskilRemove] = useState([]);
  const [listskilChange, setlistskilChange] = useState([]);
  const [nameLevel, setNameLevel] = useState(listskilGroup.name);

  const handleRemoves = (index, item) => {
    // listskilRemove.splice({id: item.id})
    listskilRemove.splice(index + 1, 0, item.id);
    // listskilRemove[index] = {id: item.id} ;
    listskilGroup.splice(index, 1);
    remove(index);
    // console.log(listskilRemove);
  };
  const handleAddName = (event, index) => {
    listskilAdd[index] = { name: event.target.value };
    // console.log(listskilAdd);
  };
  const handleAddChange = (event, index, item) => {
    setNameLevel(event.target.value);
    listskilGroup[index].name = event.target.value;
    listskilChange[index] = { name: event.target.value, id: item.id };
    // listskilChange[index].id = item.id;
  };

  const handleCloseDialogEdit = () => {
    setRefreshData(!refreshData);
    reset();
    setlistskilChange([]);
    setlistskilRemove([]);
    setlistskilAdd([]);
    setOpenDialogEdit(false);
  };

  const onSubmit = async ()  => { 
  
    const listskilChange1 = listskilChange.filter((i) => i !== null);
    // console.log(listskilChange1);

    const listskilAdd1 = listskilAdd.filter((i) => i.name !== '');
    // console.log(listskilAdd1);

    for (let i = listskilRemove.length - 1; i >= 0; i -= 1) {
      for (let j = listskilChange1.length - 1; j >= 0; j -= 1) {
        if (listskilRemove[i] === listskilChange1[j].id) {
          listskilChange1.splice(j, 1);
        }
      }
    }
  

    if (listskilChange.length === 0 && listskilRemove.length === 0 && listskilAdd.length === 0) {
      onEditRowError();
      handleCloseDialogEdit();
    } else {
      await
       Promise.all(
        listskilRemove.forEach((item) => {
           axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILLLEVEL}/${item}`,
            method: 'delete',
            headers: {
              //  "Content-Type": "multipart/form-data" 
               'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          })
            .then((response) => {
              console.log(response);
              // setRefreshData(!refreshData);
              onEditRow();
            })
            .catch((error) => console.log(error));
        })
      )
      .catch((error) => console.log(error));

      Promise.all(
        listskilAdd1.forEach((item) => {
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILLLEVEL}`,
            method: 'post',
            headers: {
              //  "Content-Type": "multipart/form-data" 
               'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
            data: {
              name: item.name,
              skill_group_id: row.id,
            },
          })
            .then(() => {
              // console.log(response);
              onEditRow();
              // setRefreshData(!refreshData);
            })
            .catch((error) => console.log(error));
        })
      )
      .catch((error) => console.log(error));

      Promise.all(
        listskilChange1.forEach((item) => {
          axios({
            url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILLLEVEL}?id=${item.id}`,
            method: 'put',
            headers: {
              //  "Content-Type": "multipart/form-data" 
               'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
            data: {
              id: item.id,
              name: item.name,
              skill_group_id: row.id,
            },
          })
            .then(() => {
              // console.log(response);
              onEditRow();
              // setRefreshData(!refreshData);
            })
            .catch((error) => console.log(error));
        })
      )
      .catch((error) => console.log(error));
    }
    handleCloseDialogEdit();
  };

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/skill-levels?page-size=50&skillGroupId=${row.id}`,
      method: 'get',
    })
      .then((response) => {
        if (response.status === 204) {
          setlistskilGroup([]);
          setlistskilGroup1([])
        } else {
          setlistskilGroup(response.data.data);
          setlistskilGroup1(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, [row.id, refreshData]);

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {row.No}
        </Typography>
      </TableCell>
      <TableCell align="left">{row.name}</TableCell>
      <TableCell align="left">
        {listskilGroup1.map((el) => (
          <Typography key={el.id}>• {el.name}</Typography>
        ))}
      </TableCell>

      <TableCell align="right">
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            setOpenDialogEdit(true);
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ color: 'primary.main' }} />
        </IconButton>
      </TableCell>
      <Dialog
        open={openDialogEdit}
        onClose={handleCloseDialogEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">Tạo/Sửa trình độ</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField disabled id="outlined-name" label="Kỹ năng" value={row.name} fullWidth variant="standard" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                {listskilGroup.map((item, index) => (
                  <Grid container key={item.id} spacing={2} style={{ padding: 5 }}>
                    <Grid item xs={11}>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          size="small"
                          id="outlined-name"
                          label="Trình độ"
                          value={listskilGroup[index]?.name}
                          variant="outlined"
                          onChange={(event) => handleAddChange(event, index, item)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        color="error"
                        onClick={() => {
                          handleRemoves(index, item);
                        }}
                      >
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={12}>
                {fields &&
                  fields.map((item, index) => (
                    <Grid container key={item.id} spacing={2} style={{ padding: 5 }}>
                      <Grid item xs={11}>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            size="small"
                            id="outlined-name"
                            label="Trình độ"
                            // value={listskilAdd[index].name}
                            name={`item[index].name`}
                            variant="outlined"
                            onChange={(event) => handleAddName(event, index)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          color="error"
                          onClick={() => {
                            handleRemove(index);
                          }}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                size="small"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleAdd}
                sx={{ flexShrink: 0 }}
              >
                Thêm trình độ
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCloseDialogEdit}>
            Huỷ
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
