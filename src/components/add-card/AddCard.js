import React, { useState } from 'react';
import { Modal } from '../../common/modal/Modal';
import styles from './AddCard.module.css';
import commonStyles from './../../common/styles/styles.module.css';
import { Alert } from '../../common/alert/Alert';

export const AddCard = ({ board, handleCardAdd, isAdd = true }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [team, setTeam] = useState([]);
  const [error, setError] = useState(null);

  function onSelectChange(e) {
    const values = [...e.target.selectedOptions].map(opt => opt.value);
    setTeam(values);
  }

  function onAdd() {
    if (!title || !description || !dueDate || team.length === 0) {
      setError('All the fields are required');
      return;
    }

    const today = new Date().getTime();
    const dueDateMili = new Date(dueDate).getTime();

    if (dueDateMili < today) {
      setError('Cannot select a past date.');
      return;
    }

    setError(null);

    const card = {
      title,
      description,
      date: new Date(dueDate),
      teamMembers: team
    };

    handleCardAdd(card);
  }

  return (
    <Modal>
      <div className={styles.modalHead}>
        <div>Add Card</div>
        <div className={styles.close}>&times;</div>
      </div>
      {error && (
        <Alert
          children={error}
          type={'error'}
          canClose={() => setError(null)}
        />
      )}
      <div className={styles.modalBody}>
        <div className={styles.formField}>
          <label htmlFor="title">Enter the title for your task</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="eg. Add a new Icon"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="title">
            Choose members for this task(select multiple, if needed)
          </label>
          <select
            name="members"
            id="members"
            multiple={true}
            value={team}
            onChange={onSelectChange}
          >
            {board.teamMembers.map(member => (
              <option value={member} key={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formField}>
          <label htmlFor="title">Add the descriptions for your task</label>
          <input
            type="text"
            name="title"
            id="description"
            placeholder="Add your description here"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor="title">Select the due date for this task</label>
          <input
            type="date"
            name="title"
            id="due_date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <button className={commonStyles.info} onClick={onAdd}>
            Add Card
          </button>
        </div>
      </div>
    </Modal>
  );
};
