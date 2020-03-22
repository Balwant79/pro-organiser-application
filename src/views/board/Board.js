import React, { useEffect, useState } from 'react';
import commonStyles from './../../common/styles/styles.module.css';
import styles from './Board.module.css';
import { Modal } from './../../common/modal/Modal';
import { getBoard } from '../../utils/data';

export const Board = ({ match }) => {
  const [board, setBoard] = useState({});
  const [isColumnAdd, setIsColumnAdd] = useState(false);

  useEffect(() => {
    getBoard(match.params.name)
      .then(data => {
        setBoard(data);
      })
      .catch(() => {
        setBoard({});
      });
  }, [match]);

  return (
    <>
      <div className={styles.container}>
        <h2 className={commonStyles.title}>
          {match.params.name.split('-').join(' ')}
        </h2>
        <div className={styles.ui}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <header>
                Main Website
                <div className={styles.trash}>
                  <i class="material-icons" style={{ fontSize: '25px' }}>
                    delete_outline
                  </i>
                </div>
              </header>
              <ul>
                <li>
                  <div className={styles.text}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Itaque, incidunt?
                  </div>
                  <div className={styles.actions}>
                    <div style={{ alignSelf: 'center', cursor: 'pointer' }}>
                      <i class="material-icons" style={{ fontSize: '30px' }}>
                        list
                      </i>
                    </div>
                    <div className={styles.team}>
                      <div className={styles.circle}>NN</div>
                      <div className={styles.circle}>AB</div>
                    </div>
                  </div>
                </li>
              </ul>
              <footer>
                <button>Add a Card</button>
              </footer>
            </div>
            <button
              id="CreateColumn"
              onClick={() => setIsColumnAdd(true)}
              className={styles.addButton}
            >
              Add column
            </button>
          </div>
        </div>
      </div>
      {isColumnAdd && (
        <Modal>
          <div className={styles.modalHead}>Add Column</div>
          <div className={styles.modalBody}>
            <div className={styles.field}>
              <label htmlFor="column_name">Enter a Column Name:</label>
              <input type="text" name="column_name" id="column_name" />
            </div>
            <div className={styles.action}>
              <button id="CreateColumn" className={commonStyles.info}>
                Add Column
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
