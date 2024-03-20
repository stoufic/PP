import yfinance as yf
import matplotlib.pyplot as plt  # Import the pyplot module
from sklearn.ensemble import RandomForestClassifier

sp500 = yf.Ticker("^GSPC")
sp500_data = sp500.history(period="max")
print(sp500_data.index)

sp500_data['Close'].plot.line()  # Plot the 'Close' column
plt.show()  # This will display the plot

# Assuming your DataFrame is named sp500_data
sp500_data = sp500_data.drop(columns=['Dividends', 'Stock Splits'])





