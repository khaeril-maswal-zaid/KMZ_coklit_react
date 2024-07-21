import React, { useState, useEffect } from "react";

const Table = () => {
  const columnNamesLeft = ["nik", "nama", "Tps"];
  const columnNamesRight = [...columnNamesLeft, "ket"]; // Menambahkan kolom "ket" ke kolom kanan

  const [dataLeft, setDataLeft] = useState(
    JSON.parse(localStorage.getItem("tableDataLeft")) ||
      Array.from({ length: 7 }, () => ({
        nik: "",
        nama: "",
        "tanggal lahir": "",
        Tps: "",
      }))
  );

  const [dataRight, setDataRight] = useState(
    JSON.parse(localStorage.getItem("tableDataRight")) ||
      Array.from({ length: 7 }, () => ({
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
    if (tableType === "left") {
      const newData = [...dataLeft];
      newData[rowIndex][colName] = value;
      setDataLeft(newData);
    } else if (tableType === "right") {
      const newData = [...dataRight];
      newData[rowIndex][colName] = value;
      setDataRight(newData);
    }
  };

  const addRow = (tableType) => {
    if (tableType === "left") {
      setDataLeft([
        ...dataLeft,
        { nik: "", nama: "", "tanggal lahir": "", Tps: "" },
      ]);
    } else if (tableType === "right") {
      setDataRight([
        ...dataRight,
        { ...Object.fromEntries(columnNamesRight.map((name) => [name, ""])) },
      ]);
    }
  };

  const deleteRow = (tableType, index) => {
    if (tableType === "left") {
      const newData = [...dataLeft];
      newData.splice(index, 1);
      setDataLeft(newData);
    } else if (tableType === "right") {
      const newData = [...dataRight];
      newData.splice(index, 1);
      setDataRight(newData);
    }
  };

  const clearData = (tableType) => {
    if (tableType === "left") {
      setDataLeft(
        Array.from({ length: 7 }, () => ({
          nik: "",
          nama: "",
          "tanggal lahir": "",
          Tps: "",
        }))
      );
    } else if (tableType === "right") {
      setDataRight(
        Array.from({ length: 7 }, () => ({
          ...Object.fromEntries(columnNamesRight.map((name) => [name, ""])),
        }))
      );
    }
  };

  const handlePaste = (tableType, e) => {
    const clipboardData = e.clipboardData.getData("Text");
    const rows = clipboardData.split("\n").map((row) => row.split("\t"));

    if (tableType === "left") {
      const newData = [...dataLeft];
      rows.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (
            newData[rowIndex] &&
            newData[rowIndex][columnNamesLeft[colIndex]] !== undefined
          ) {
            newData[rowIndex][columnNamesLeft[colIndex]] = cell;
          }
        });
      });
      setDataLeft(newData);
    } else if (tableType === "right") {
      const newData = [...dataRight];
      rows.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (
            newData[rowIndex] &&
            newData[rowIndex][columnNamesRight[colIndex]] !== undefined
          ) {
            newData[rowIndex][columnNamesRight[colIndex]] = cell;
          }
        });
      });
      setDataRight(newData);
    }

    e.preventDefault();
  };

  const checkData = () => {
    const updatedTableB = dataRight.map((rowB) => {
      if (!rowB.nik) {
        return { ...rowB, ket: "" }; // Kosongkan 'ket' jika NIK kosong di table B
      }

      const existsInTableA = dataLeft.some((rowA) => rowA.nik === rowB.nik);
      return {
        ...rowB,
        ket: existsInTableA ? "Sudah dipotensialkan" : "Belum dipotensialkan",
      };
    });
    setDataRight(updatedTableB);
  };

  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <div
          className="overflow-x-auto"
          onPaste={(e) => handlePaste("left", e)}
        >
          <div className="mb-4 space-x-2">
            <button
              onClick={() => addRow("left")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Row
            </button>
            <button
              onClick={() => clearData("left")}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Restart Data
            </button>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-300">Actions</th>
                {columnNamesLeft.map((columnName, colIndex) => (
                  <th key={colIndex} className="py-2 border-b border-gray-300">
                    {columnName.charAt(0).toUpperCase() + columnName.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataLeft.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      onClick={() => deleteRow("left", rowIndex)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                  {columnNamesLeft.map((colName, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-2 px-1 border-b border-gray-300"
                    >
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-1/2 p-4">
        <div
          className="overflow-x-auto"
          onPaste={(e) => handlePaste("right", e)}
        >
          <div className="mb-4 space-x-2">
            <button
              onClick={() => addRow("right")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Row
            </button>
            <button
              onClick={() => clearData("right")}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Restart Data
            </button>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {columnNamesRight.map((columnName, colIndex) => (
                  <th key={colIndex} className="py-2 border-b border-gray-300">
                    {columnName.charAt(0).toUpperCase() + columnName.slice(1)}
                  </th>
                ))}
                <th className="py-2 px-4 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataRight.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columnNamesRight.map((colName, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-2 px-1 border-b border-gray-300"
                    >
                      {colName === "ket" ? (
                        <span>{row[colName]}</span>
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
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      onClick={() => deleteRow("right", rowIndex)}
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
  );
};

export default Table;
