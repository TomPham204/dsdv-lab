import pandas as pd

if __name__ == '__main__':

    df = pd.read_csv('./covid-data-v4.csv')
    # This dataset contained 4 rows of data but multiple columns: Country and a list of dates
    # >> Convert the data to the correct format: Country, Date, Cases
    # >> Hint: Use the melt() function
    df = pd.melt(df, id_vars=['Country'], var_name='Date', value_name='Cases')
    
    # Currently the date format is mm/dd/yyyy --> Switch to appropriate format
    print(df.info())
    df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y')

    print(df.head(10))
    print(df.shape) # Expected: 124 rows, 3 columns as we have 4 countries and 30 days on April + 1 day for May

    df.to_csv('./covid-data-v5.csv', index=False)
    
    # We should run the sorting on the country and date
    df = df.sort_values(['Country', 'Date'])
    print(df.head(10))
    
    df.to_csv('./covid-data-v6.csv', index=False)