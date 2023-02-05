import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, IconButton, Tooltip } from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../components/Iconify';


// ----------------------------------------------------------------------

TransTableToolbar.propTypes = {
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterEndDate: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  onReset: PropTypes.func,
  onClear: PropTypes.func,
};
const INPUT_WIDTH = 160;
export default function TransTableToolbar({
  filterStartDate,
  filterEndDate,
  onFilterStartDate,
  onFilterEndDate,
onReset,
onClear
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      
      <DatePicker
        label="Ngày bắt đầu"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label="Ngày kết thúc"
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />
       <Tooltip title="Tìm kiếm">
        <IconButton
              onClick={() => {
               onReset()
              }}
              color="info"
            >
              <Iconify icon={'ic:baseline-search'} color="success" width={40} height={40} />
            </IconButton>
            </Tooltip>
            {(() => {
              if(filterStartDate !== null && filterEndDate !== null) {

                return (
                  <Tooltip title="Xoá">
                  <IconButton
                        onClick={() => {
                         onClear()
                        }}
                        color="error"
                      >
                        <Iconify icon={'mdi:clear-circle'} color="success" width={45} height={15} />
                      </IconButton>
                      </Tooltip>
                  );
               
              }
          
          })()}
           
    
    </Stack>
  );
}
