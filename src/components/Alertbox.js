// คอมโพเนนต์ ShowAlertAndOpenModal
const ShowAlertAndOpenModal = ({
  modalId,
  notice,
  message,
  closeModal,
  modalRef,
}) => {
  return (
    <>
      <dialog id={modalId} className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold">{notice}</h3>
          <p id="modal_message" className="py-4 text-center text-gray-500">
            {message}
          </p>
        </div>
      </dialog>
    </>
  );
};

export default ShowAlertAndOpenModal;
