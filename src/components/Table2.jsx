import React, { useState, useEffect } from "react";

const Table = () => {
  const columnNames = ["nik", "nama"];
  const columnNamesLeft = [...columnNames, "Tps"];
  const columnNamesRight = [...columnNames, "ket"]; // Adds "ket" column to the right table

  const initialRow = {
    nik: "",
    nama: "",
    "tanggal lahir": "",
    Tps: "",
  };

  const [dataLeft, setDataLeft] = useState(
    JSON.parse(localStorage.getItem("tableDataLeft")) ||
      Array.from({ length: 16 }, () => ({ ...initialRow }))
  );

  const [dataRight, setDataRight] = useState(
    JSON.parse(localStorage.getItem("tableDataRight")) ||
      Array.from({ length: 16 }, () => ({
        ...Object.fromEntries(columnNamesRight.map((name) => [name, ""])),
      }))
  );

  useEffect(() => {
    localStorage.setItem("tableDataLeft", JSON.stringify(dataLeft));
  }, [dataLeft]);

  useEffect(() => {
    localStorage.setItem("tableDataRight", JSON.stringify(dataRight));
  }, [dataRight]);

  useEffect(() => {
    checkData();
  }, [dataLeft, dataRight]);

  const handleChange = (tableType, rowIndex, colName, value) => {
    const newData = tableType === "left" ? [...dataLeft] : [...dataRight];
    newData[rowIndex][colName] = value;
    tableType === "left" ? setDataLeft(newData) : setDataRight(newData);
  };

  const addRow = () => {
    setDataLeft([...dataLeft, { ...initialRow }]);
    setDataRight([
      ...dataRight,
      { ...Object.fromEntries(columnNamesRight.map((name) => [name, ""])) },
    ]);
  };

  const deleteRow = (tableType, index) => {
    const newDataLeft = [...dataLeft];
    const newDataRight = [...dataRight];

    newDataLeft.splice(index, 1);
    newDataRight.splice(index, 1); // Menghapus baris yang sesuai dari Tabel B

    setDataLeft(newDataLeft);
    setDataRight(newDataRight);
  };

  const clearData = () => {
    setDataLeft(Array.from({ length: 16 }, () => ({ ...initialRow })));
    setDataRight(
      Array.from({ length: 16 }, () => ({
        ...Object.fromEntries(columnNamesRight.map((name) => [name, ""])),
      }))
    );
  };

  const handlePaste = (tableType, e) => {
    const clipboardData = e.clipboardData.getData("Text");
    const rows = clipboardData.split("\n").map((row) => row.split("\t"));

    const newData = tableType === "left" ? [...dataLeft] : [...dataRight];
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (
          newData[rowIndex] &&
          newData[rowIndex][
            tableType === "left"
              ? columnNamesLeft[colIndex]
              : columnNamesRight[colIndex]
          ] !== undefined
        ) {
          newData[rowIndex][
            tableType === "left"
              ? columnNamesLeft[colIndex]
              : columnNamesRight[colIndex]
          ] = cell;
        }
      });
    });

    tableType === "left" ? setDataLeft(newData) : setDataRight(newData);
    e.preventDefault();
  };

  const checkData = () => {
    const updatedTableB = dataRight.map((rowB) => {
      if (!rowB.nik) {
        return { ...rowB, ket: "" }; // Kosongkan 'ket' jika NIK kosong di table B
      }

      // Cari baris yang sesuai di tabel kiri
      const correspondingRowLeft = dataLeft.find(
        (rowA) => rowA.nik === rowB.nik
      );

      // Buat teks keterangan berdasarkan nilai Tps dari tabel kiri
      let keterangan = "";
      if (correspondingRowLeft) {
        keterangan = `Potensial di TPS ${correspondingRowLeft.Tps}`;
      } else {
        keterangan = "Belum dipotensial";
      }

      return {
        ...rowB,
        ket: keterangan,
      };
    });

    setDataRight(updatedTableB);
  };

  return (
    <div className="table-kmz">
      <div className="px-4 mt-7 space-x-2">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Row
        </button>
        <button
          onClick={clearData}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Restart Data
        </button>
      </div>

      <div className="flex">
        <div className="w-1/2 p-4">
          <div
            className="overflow-x-auto"
            onPaste={(e) => handlePaste("right", e)}
          >
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th
                    className="py-2 px-4 border-b border-gray-300"
                    colSpan={4}
                  >
                    PEMILIH TMS-8
                  </th>
                </tr>
                <tr>
                  {columnNamesRight.map((columnName, colIndex) => (
                    <th
                      key={colIndex}
                      className="py-2 border-b border-gray-300"
                    >
                      {columnName.charAt(0).toUpperCase() + columnName.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRight.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columnNamesRight.map((colName, colIndex) => (
                      <td key={colIndex} className="">
                        {colName === "ket" ? (
                          <input
                            type="text"
                            value={row[colName]}
                            readOnly
                            onChange={(e) =>
                              handleChange(
                                "right",
                                rowIndex,
                                colName,
                                e.target.value
                              )
                            }
                            className={`w-full px-2 py-1 rounded ${
                              row[colName] === "Belum dipotensial"
                                ? "bg-red-200"
                                : "bg-gray-100"
                            }`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[colName]}
                            onChange={(e) =>
                              handleChange(
                                "right",
                                rowIndex,
                                colName,
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/2 p-4">
          <div
            className="overflow-x-auto"
            onPaste={(e) => handlePaste("left", e)}
          >
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th
                    className="py-2 px-4 border-b border-gray-300"
                    colSpan={4}
                  >
                    PEMILIH POTENSIAL
                  </th>
                </tr>
                <tr>
                  {columnNamesLeft.map((columnName, colIndex) => (
                    <th
                      key={colIndex}
                      className="py-2 border-b border-gray-300"
                    >
                      {columnName.charAt(0).toUpperCase() + columnName.slice(1)}
                    </th>
                  ))}

                  <th className="py-2 px-4 border-b border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataLeft.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columnNamesLeft.map((colName, colIndex) => (
                      <td key={colIndex} className="">
                        <input
                          type="text"
                          value={row[colName]}
                          onChange={(e) =>
                            handleChange(
                              "left",
                              rowIndex,
                              colName,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                    ))}

                    <td className="text-center">
                      <button
                        onClick={() => deleteRow("left", rowIndex)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
