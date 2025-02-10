import React, { useEffect, useState } from "react";
import axios from "axios";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://192.168.0.110:8000/hosts/rooms/");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://192.168.0.110:8000/hosts/rooms/${editRoom.id}/`, editRoom);
      fetchRooms();
      setIsEditing(false);
      setEditRoom(null);
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteRoomId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://192.168.0.110:8000/hosts/rooms/${deleteRoomId}/`);
      fetchRooms();
      setShowModal(false);
      setDeleteRoomId(null);
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Rooms Management</h1>
      <div className="row">
        {rooms.map((room) => (
          <div key={room.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={room.photo}
                alt={room.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">Price: {room.price} KES</p>
                <p className="card-text">{room.description}</p>
                <p
                  className={`card-text ${
                    room.is_available ? "text-success" : "text-danger"
                  }`}
                >
                  {room.is_available ? "Available" : "Not Available"}
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(room)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => confirmDelete(room.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-5">
          <h2>Edit Room</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label className="form-label">Room Name</label>
              <input
                type="text"
                className="form-control"
                value={editRoom.name}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                value={editRoom.price}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, price: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={editRoom.description}
                onChange={(e) =>
                  setEditRoom({ ...editRoom, description: e.target.value })
                }
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                  Confirm Deletion
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this room?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
