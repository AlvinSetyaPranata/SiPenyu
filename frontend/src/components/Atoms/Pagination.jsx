import React, { useEffect, useState } from "react";
import { cleanColumnName, extractDataColumnName } from "../../utils/data";
import DoubleChevronLeft from "../SVG/DoubleChevronLeft";
import DoubleChevronRight from "../SVG/DoubleChevronRight";
import MacTerminal from "../MacTerminal";

export default function Pagination() {
  const [selectedTableCategory, setSelectedTableCategory] =
    useState("subdistrict");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("");
  const [_, setForceUpdate] = useState(false);

  const [tableData, setTableData] = useState({
    columns: [],
    value: [{}],
  });

  const getTableData = async () => {
    await fetch(`${import.meta.env.VITE_BASE_API_URL}/${selectedTableCategory}`)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        }
        return null;
      })
      .then((data) => setTableData(extractDataColumnName(data.data)));
  };

  const handlePage = (id) => {};

  useEffect(() => {
    // Change to fetch data to the server
    setForceUpdate((state) => !state);
  }, [searchValue, filter]);

  useEffect(() => {
    getTableData();
  }, [selectedTableCategory]);

  useEffect(() => {
    getTableData();
  }, []);

  return (
    <MacTerminal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <input
          type="text"
          className="border-[1.5px] border-gray-300 rounded-md px-4 py-2 text-gray-500 text-sm col-span-2"
          placeholder="Filter data bedasarkan kategori yang dipilih"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <select
          value={selectedTableCategory}
          onChange={(e) => setSelectedTableCategory(e.target.value)}
          className="py-2 rounded-md px-4 text-sm text-gray-600"
        >
          <option value="statistic/subdistrict">Kecamatan</option>
          <option value="organization">Organisasi</option>
          <option value="business">Wirausaha</option>
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="py-2 rounded-md px-4 text-sm text-gray-600"
        >
          <option value="">Filter bedasarkan nama</option>
          {tableData.columns.map((column, index) => (
            <option key={index} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto py-6">
        <table className="table-auto w-full mt-6 text-sm border border-gray-300">
          <thead>
            <tr>
              {tableData.columns.map((column, index) => (
                <th
                  key={index}
                  className="text-center border-r border-l  border-gray-400 bg-gray-300 py-2 px-4 font-semibold"
                >
                  {cleanColumnName(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(searchValue != "") & (selectedTableCategory != "")
              ? tableData.value
                  .filter((data) => {
                    if (!data[filter] || searchValue == "") return true;

                    return data[filter]
                      .toLowerCase()
                      .includes(searchValue.toLowerCase());
                  })
                  .map((rowData, index) => (
                    <tr key={index}>
                      {Object.keys(rowData).map((key, colIndex) => (
                        <td
                          key={colIndex}
                          className="border-l border-r border-gray-300 text-center py-2 px-4"
                        >
                          {/* {rowData[key]} */}
                          {console.log(rowData[key])}
                        </td>
                      ))}
                    </tr>
                  ))
              : tableData.value
                  .slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5)
                  .map((rowData, index) => (
                    <tr key={index}>
                      {Object.keys(rowData).map((key, colIndex) => (
                        <td
                          key={colIndex}
                          className="border-l border-r border-gray-300 text-center py-2 px-4"
                        >
                          {typeof rowData[key] == "object"
                            ? rowData[key]["name"]
                            : rowData[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>

        <div className="w-full flex items-center gap-x-4 mt-8">
          <button
            className="text-xs px-3 py-2 bg-gray-200 border border-gray-300"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <DoubleChevronLeft />
          </button>

          {/* Pagination Buttons */}
          {Array.from(
            { length: Math.ceil(tableData.value.length / 5) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`text-xs px-3 py-2 bg-gray-200 border border-gray-300 ${
                  currentPage === i + 1 ? "bg-secondary text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            className="text-xs px-3 py-2 bg-gray-200 border border-gray-300"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(tableData.value.length / 5))
              )
            }
          >
            <DoubleChevronRight />
          </button>
        </div>
      </div>
    </MacTerminal>
  );
}
