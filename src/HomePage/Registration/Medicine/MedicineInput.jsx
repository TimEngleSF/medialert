import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const MedicineInput = ({ medicines, setMedicines }) => {
  const [medicineValue, setMedicineValue] = useState('');
  const [time, setTime] = useState('');

  const inputRef = useRef(0);
  const selectRef = useRef();
  // const [medicines, setMedicines] = useState([]);
  const handleMedChange = (e) => {
    setMedicineValue(e.target.value);
  };

  const handleSelect = (e) => {
    setTime(e.target.value);
  };

  const handleAdd = () => {
    if (!medicineValue || !time) {
      return;
    }
    const medicine = { name: medicineValue, time };
    setMedicines([...medicines, medicine]);
    setMedicineValue('');
    setTime('');
    inputRef.current.focus();
    selectRef.current.selectedIndex = 0;
  };

  //TODO Add

  return (
    <li className="flex flex-col">
      <div className="mb-2">
        <input
          ref={inputRef}
          className="h-8 outline outline-1 indent-1 rounded-md w-full"
          type="text"
          onChange={handleMedChange}
          value={medicineValue}
        />
      </div>
      <div className="flex justify-between">
        <select
          ref={selectRef}
          onChange={handleSelect}
          className="h-8 outline outline-1 indent-1 rounded-md"
        >
          <option value="">--Choose Time--</option>
          <option value="00:00">12:00 AM</option>
          <option value="00:30">12:30 AM</option>
          <option value="01:00">1:00 AM</option>
          <option value="01:30">1:30 AM</option>
          <option value="02:00">2:00 AM</option>
          <option value="02:30">2:30 AM</option>
          <option value="03:00">3:00 AM</option>
          <option value="03:30">3:30 AM</option>
          <option value="04:00">4:00 AM</option>
          <option value="04:30">4:30 AM</option>
          <option value="05:00">5:00 AM</option>
          <option value="05:30">5:30 AM</option>
          <option value="06:00">6:00 AM</option>
          <option value="06:30">6:30 AM</option>
          <option value="07:00">7:00 AM</option>
          <option value="07:30">7:30 AM</option>
          <option value="08:00">8:00 AM</option>
          <option value="08:30">8:30 AM</option>
          <option value="09:00">9:00 AM</option>
          <option value="09:30">9:30 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="10:30">10:30 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="11:30">11:30 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="12:30">12:30 PM</option>
          <option value="13:00">1:00 PM</option>
          <option value="13:30">1:30 PM</option>
          <option value="14:00">2:00 PM</option>
          <option value="14:30">2:30 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="15:30">3:30 PM</option>
          <option value="16:00">4:00 PM</option>
          <option value="16:30">4:30 PM</option>
          <option value="17:00">5:00 PM</option>
          <option value="17:30">5:30 PM</option>
          <option value="18:00">6:00 PM</option>
          <option value="18:30">6:30 PM</option>
          <option value="19:00">7:00 PM</option>
          <option value="19:30">7:30 PM</option>
          <option value="20:00">8:00 PM</option>
          <option value="20:30">8:30 PM</option>
          <option value="21:00">9:00 PM</option>
          <option value="21:30">9:30 PM</option>
          <option value="22:00">10:00 PM</option>
          <option value="22:30">10:30 PM</option>
          <option value="23:00">11:00 PM</option>
          <option value="23:30">11:30 PM</option>
        </select>
        <button
          type="button"
          className={`cursor-pointer h-8 w-16 rounded-md outline   text-white bg-sky-400 font-semibold tracking-wider`}
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </li>
  );
};

MedicineInput.propTypes = {
  medicines: PropTypes.array,
  setMedicines: PropTypes.func,
};
export default MedicineInput;
