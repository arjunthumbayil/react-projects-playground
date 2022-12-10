// Restarting grocery bud
import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

//This part gets the values stored in the localhost
const getLocalStorage = () => {
  const item = localStorage.getItem("list");
  if (item) {
    return JSON.parse(item);
  }
  return [];
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "hello",
    type: "success",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // display alert
      showAlert(true, "danger", "please enter value ");
    } else if (name && isEditing) {
      // deal with edit part below
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "success", "Item edited!");
    } else {
      // show alert part below
      showAlert(true, "success", "item added to the list");

      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const deleteAllItems = () => {
    showAlert(true, "danger", "All items deleted from list!");
    setList([]);
  };

  const deleteIndividualItem = (id) => {
    showAlert(true, "danger", "Items removed!");
    setList((list) => list.filter((item) => item.id !== id));
  };

  const editIndividualItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. Water"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List
            items={list}
            deleteIndividualItem={deleteIndividualItem}
            editIndividualItem={editIndividualItem}
          />
          <button className="clear-btn" onClick={deleteAllItems}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
