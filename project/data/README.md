# Data Science & Data Visualization
------

Deadline: 30/04/2023

# Introduction

The intention of this module is to standardize the dataset we used for visualization. Additional steps has been done to futher 
remove more redundant attributes. This included five different CSV including:

1. DIM_Customer.csv 
    - This file would show the customer information. Some main important attributes are 'CustomerKey', 'Gender', 'Customer City'. Another value is 'DateFirstPurchase' has lower priority
2. DIM_Products.csv
    - This file would show the metadata of the products. Some main attributes are 'ProductKey', 'ProductItemCode', and 'Product Status' (either Outdate or Current). Some additional attributes can be used for dynamic data filtering are 'Sub Category', 'Product Category', and 'Product Pre-Code' -> This is expected to compute at the source code but not the data (2 first characters of the 'ProductItemCode'.
3. FactInternetSale.csv
    - This file shows the market trade between customer and trader through products. Some main important attributes are 'ProductKey', 'CustomerKey', 'SalesAmount', and probably 'SalesOrderNumber'. You should expect to choose one of three date keys: 'OrderDateKey', 'DueDateKey', and 'ShipDateKey' and strictly follow it to create a time-series visualization and data filtering. However, based on my observation 'DueDateKey' = 'OrderDateKey' + 12 (days) = 'ShipDateKey' + 5 (days) so my recommendation is to follow the 'ShipDateKey'.
4. SalesBudget.csv 
    - I have modified it for better support. This file is to demonstrate the budget that have been spent by the company. You could corporate with the FactInternetSale.csv dataset to track the cash flow by time-series

Another unimportant file is Dim_Date_Excel.csv which is probably programmatically generated is DIM_DATE_EXCEL.csv to generate a table of time schedule, thus you can ignore the file.

# Expectation:

Based on the four figures available at the "reference" folder, we can rebuilt the visualization to make it more attractive and gain more understanding. The following list would define some basic steps

1. Identify the chart/figure that can extract some ideas and derive some meaningful messages to the audience.
2. Separate those charts into different HTML5 web file along with one central managment page to locate and quickly link them
3. Draw the charts and add filthering
4. Create some data filtering that can join, select, groupby, filtering (dynamically). Add some features if possible: local-view, TBD, ...
5. Document the necessary steps to re-build, along with the tools/framework and some conveying message of the chart
6. Clean-up : Review these charts and add more clarifications such as legend, label, ...

# Step 01 & 02: Data Analytics
Based on the database structure, we summarized some basic charts we can visualize as following (The extension is infomative only). More charts can be add up to this list. Duplicated charts are OK if they are relevant, but don't overuse it

1. Products.html
    - Track the cash flow of each product and sub-product (based on 'Product Pre-Code') by time-series and sorting them based on the total columns (both vertical/horizontal)
    - Track the top 10/20 products with highest/lowest sales based on time-series
    - Track the sales of the products based on its status ('Product Status'), merged with sub-category if possible

2. Sales.html
    - Track the budget and sales using the direct value (for each month) method or the accumulative method (sales, budget are accumulated)
    - Visualize the sales and budget flow (amount ratio, progress) to let accumulated sales > budget (or smaller)
    - Track sales by product category or sub-category
    - Track sales by customer city, use the geographical map is recommend (localview, ...)
    - Track sales by product name

3. Customers.html
    - Track product sales or total sales by gender
    - Track product sales or total sales by customer city
    - Track sales by user
    - Track sales by month

# Step 03

DON'T COPY as the reference image. Also don't implement every features and not force EVERY charts to follow as not every figures (underlying meaning can support). Enough and simplicity is the best, DON'T OVERDO and focus on your conveying message.

Some data filtering are:
- Time Series: (Month & Year), (Month only & All years) or (Year only & All months) -> Mean + Std
- Filtering Attributes are: Customer City, Sub-Category, Category, Product Pre-Code, Gender, City, Pr
- Time Mode: Individual or Accumulative

# Step 04

# Step 05

# Step 06



## DATA VISUALIZATION
##### i. Entity Relationship Diagram Model
![1  Model Relations](https://user-images.githubusercontent.com/45898995/119708373-e8bfb780-be7d-11eb-90b2-5da0afdedcce.PNG)

#### ii. Sales Overview DASHBOARD
![2  Sales Overview](https://user-images.githubusercontent.com/45898995/119709090-a64aaa80-be7e-11eb-91bc-4870483b1401.png)

#### iii. Customer Details DASHBOARD
![3  Customer Details](https://user-images.githubusercontent.com/45898995/119709961-a4351b80-be7f-11eb-87b8-13c6315b6eba.png)

#### iv. Product Details DASHBOARD
![4  Product Details](https://user-images.githubusercontent.com/45898995/119710084-c464da80-be7f-11eb-90b3-8e50a0f4ae20.png)
