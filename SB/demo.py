import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# Fetch historical stock data
symbol = input("Enter the stock symbol: ")
ticker = yf.Ticker(symbol)
data = ticker.history(period="5y")  # Using 5 years of data

# Print the most recent market price
most_recent_price = data['Close'].iloc[-1]
print(f"Today's Market Price (or most recent): {most_recent_price}")

# Prepare the data for the model
data['Target'] = data['Close'].shift(-1)
data.dropna(inplace=True)

features = ['Open', 'High', 'Low', 'Close', 'Volume']
X = data[features]
y = data['Target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Initialize an empty list to store predicted prices
predicted_prices = []

# Convert the last row of feature data into a DataFrame to maintain feature names
latest_data_df = data[features].tail(1)

# Predict the next week's closing prices using a loop
for _ in range(5):  # Assuming 5 trading days in a week
    # Predict the next day's closing price
    next_day_prediction = model.predict(latest_data_df)
    
    # Append the predicted price to the list
    predicted_prices.append(next_day_prediction[0])
    
    # Update the latest data for the next prediction
    latest_data_df = np.roll(latest_data_df, -1, axis=1)
    latest_data_df[0, -1] = next_day_prediction  # Set the last column (assumed to be 'Close') to the predicted value

# Check if predicted_prices is not empty before accessing its last element
if predicted_prices:
    print(f"Predicted Closing Price for Next Week's Last Trading Day: {predicted_prices[-1]}")
else:
    print("No predicted prices available.")
