from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_form():
    data = request.json
    df = pd.DataFrame([data])

    # Check if the file exists
    file_exists = os.path.isfile('fleet_data.xlsx')

    try:
        with pd.ExcelWriter('fleet_data.xlsx', mode='a', engine='openpyxl', if_sheet_exists='overlay') as writer:
            if not file_exists:
                df.to_excel(writer, index=False, sheet_name='Sheet1')
            else:
                df.to_excel(writer, index=False, sheet_name='Sheet1', startrow=writer.sheets['Sheet1'].max_row, header=False)
        return jsonify({'message': 'Data saved successfully!'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Error saving data.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
