import React, { useEffect, useState } from 'react';
import commonStyles from './../../common/styles/styles.module.css';
import styles from './Board.module.css';
import {
  getBoard,
  getColumns,
  addColumn,
  updateColumn
} from '../../utils/data';
import { Loader } from '../../common/loader/Loader';
import { Card } from '../../components/card/Card';
import { AddCard } from '../../components/add-card/AddCard';
import { AddColumn } from '../../components/add-column/AddColumn';
import { createDeepCopy } from '../../utils/utility';

export const Board = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState({});
  const [isColumnAdd, setIsColumnAdd] = useState(false);
  const [columns, setColumns] = useState([]);
  const [isCardAdd, setIsCardAdd] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isAdd, setIsAdd] = useState(true);
  const [inEditCard, setInEditCard] = useState(null);

  useEffect(() => {
    (async function() {
      const data = await getBoard(match.params.name);
      setBoard(data);
      await getAllColumns(data.id, setColumns);
      setLoading(false);
    })();
  }, [match]);

  function handleAddCloumn(columnName) {
    const newColumn = {
      boardId: board.id,
      name: columnName,
      cards: [],
      created: Date.now()
    };

    addColumn(newColumn).then(value => {
      if (value) {
        newColumn['id'] = value;
        setColumns([...columns, newColumn]);
        setIsColumnAdd(false);
      }
    });
  }

  function handleModalClose() {
    setIsColumnAdd(false);
  }

  function openAddCard(column) {
    setIsCardAdd(true);
    setSelectedColumn(column);
    setInEditCard(null);
  }

  async function addCard(card) {
    try {
      card['id'] = selectedColumn.cards.length + 1;
      const cards = [...selectedColumn.cards, card];
      const uColumn = createDeepCopy(selectedColumn);
      uColumn.cards = cards;
      const val = await updateColumn(uColumn.id, uColumn);
      if (val) {
        afterUpdateColumn(columns, selectedColumn, uColumn, setColumns);
        setIsCardAdd(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function openCardEdit(card, column) {
    setIsAdd(false);
    setIsCardAdd(true);
    setSelectedColumn(column);
    setInEditCard(card);
  }

  async function handleCardEdit(upCard) {
    try {
      const card = { id: inEditCard.id, ...upCard };
      const uColumn = createDeepCopy(selectedColumn);
      const cards = selectedColumn.cards.filter(c => c.id !== inEditCard.id);
      const newCards = [...cards, card].sort((a, b) => a.id - b.id);
      uColumn.cards = newCards;
      const val = await updateColumn(selectedColumn.id, uColumn);
      if (val) {
        afterUpdateColumn(columns, selectedColumn, uColumn, setColumns);
        setIsAdd(true);
        setIsCardAdd(false);
        setSelectedColumn(null);
        setInEditCard(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCardArchive(card, column) {
    card.isArchive = true;
    const newCards = column.cards.filter(c => c.id !== card.id);
    const upColumn = createDeepCopy(column);
    upColumn.cards = [...newCards, card].sort((a, b) => a.id - b.id);
    const val = await updateColumn(column.id, upColumn);
    if (val) {
      afterUpdateColumn(columns, column, upColumn, setColumns);
    }
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <h2 className={commonStyles.title}>{board.name}</h2>
            <button className={commonStyles.danger}>Delete Board</button>
          </div>
          <div className={styles.ui}>
            <div className={styles.columns}>
              {columns.map(column => {
                return (
                  <div className={styles.column} key={column.id}>
                    <header>
                      {column.name}
                      <div className={styles.trash}>
                        <i
                          className="material-icons"
                          style={{ fontSize: '25px' }}
                        >
                          delete_outline
                        </i>
                      </div>
                    </header>
                    <ul>
                      {column.cards.map(
                        card =>
                          !card.isArchive && (
                            <Card
                              card={card}
                              board={board}
                              key={card.id}
                              hanldeEdit={() => openCardEdit(card, column)}
                              hanldeArchive={() =>
                                handleCardArchive(card, column)
                              }
                            />
                          )
                      )}
                    </ul>
                    <footer>
                      <button onClick={() => openAddCard(column)}>
                        Add a Card
                      </button>
                    </footer>
                  </div>
                );
              })}
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
      )}
      {isColumnAdd && (
        <AddColumn handleClose={handleModalClose} handleAdd={handleAddCloumn} />
      )}
      {isCardAdd && (
        <AddCard
          board={board}
          handleCardAdd={addCard}
          handleClose={() => setIsCardAdd(false)}
          isAdd={isAdd}
          card={inEditCard}
          handleEdit={handleCardEdit}
        />
      )}
    </>
  );
};

function afterUpdateColumn(columns, selectedColumn, upColumn, setColumns) {
  const filColumns = columns.filter(cl => cl.id !== selectedColumn.id);
  const newColumns = [...filColumns, upColumn];
  newColumns.sort((a, b) => a.created - b.created);
  setColumns(newColumns);
}

async function getAllColumns(id, setColumns) {
  const resCols = await getColumns(id);
  setColumns(resCols);
}
