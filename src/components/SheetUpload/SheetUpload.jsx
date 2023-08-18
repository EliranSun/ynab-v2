import * as xlsx from "xlsx";
import { noop } from "lodash";

const SheetUpload = ({ label = "", onSheetParse = noop }) => {
    return (
        <form>
            {label && <label htmlFor="upload">{label}</label>}
            <input
                type="file"
                name="upload"
                id="upload"
                onChange={(event) => {
                    event.preventDefault();
                    if (event.target.files) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const data = e.target.result;
                            const workbook = xlsx.read(data, { type: "array" });
                            const sheetName = workbook.SheetNames[0];
                            const worksheet = workbook.Sheets[sheetName];
                            const json = xlsx.utils.sheet_to_json(worksheet);
                            console.log({ json });
                            onSheetParse(json);
                        };
                        reader.readAsArrayBuffer(event.target.files[0]);
                    }
                }}
            />
        </form>
    );
};

export default SheetUpload;
