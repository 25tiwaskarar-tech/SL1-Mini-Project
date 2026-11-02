# Test Batting Explorer

A Software Laboratory Mini Project that explores and analyzes Test cricket batting statistics using **Python, Pandas, NumPy, Matplotlib, Seaborn, HTML, CSS, and JavaScript**.

The project includes a Python-based data analysis notebook and a browser-based dashboard for exploring the batting records of 3,001 Test cricketers (data available up to 2019).

## Project Overview

Test Batting Explorer helps users understand and compare the batting performances of Test cricket players, countries, and debut decades. It processes player career statistics, calculates additional performance metrics, generates leaderboards, and presents insights through tables and visualizations.

## Features

### Python Data Analysis
- Loads and examines the Test batting dataset using Pandas.
- Checks missing values and reviews data types.
- Converts country codes into full country names.
- Calculates runs per match and century conversion percentage.
- Identifies qualified players using a minimum career total of 1,000 runs for selected comparisons.
- Generates leaderboards for:
  - Most career runs
  - Highest batting average
  - Most hundreds and fifties
  - Most ducks
  - Highest runs per match
  - Best century conversion
- Compares batting statistics across countries, player categories, and debut decades.
- Examines correlations between batting statistics.
- Exports the processed dataset to `test_batting_clean.csv`.

### Interactive Web Dashboard
- Displays summary statistics for the dataset.
- Explores player and country performance metrics.
- Provides sortable rankings and comparison tables.
- Presents statistical information through charts, including bar and pie charts.
- Supports exploration of player, country, and decade-level records.

## Technologies Used

| Technology | Purpose |
|---|---|
| Python 3 | Data analysis and processing |
| Pandas | Data loading, cleaning, and grouping |
| NumPy | Numerical calculations |
| Matplotlib | Data visualization |
| Seaborn | Statistical charts |
| Jupyter Notebook | Interactive Python analysis |
| HTML | Dashboard structure |
| CSS | Dashboard styling and responsive layout |
| JavaScript | Dashboard calculations and interactions |

## Project Structure

```text
SL-MiniProject/
│
├── Test Batting Explorer1.html
│   └── Browser-based batting statistics dashboard
│
├── style.css
│   └── Styles and responsive layout for the dashboard
│
├── script.js
│   └── Dashboard logic, calculations, rankings, and charts
│
├── data.js
│   └── Test batting dataset used by the dashboard
│
├── test_batting.csv
│   └── Dataset used for Python analysis
│
└── test_batting_analysis_simple.ipynb
    └── Python data analysis notebook
```

## Dataset Description

The dataset contains Test cricket career statistics for 3,001 players, covering records up to 2019.

Important columns include:

| Column | Description |
|---|---|
| `name` | Player name |
| `country` | Player's country code |
| `span` | Years during which the player played Test cricket |
| `mat` | Matches played |
| `inn` | Innings batted |
| `no` | Not-out innings |
| `runs` | Total career runs |
| `hs` | Highest individual score |
| `avg` | Batting average |
| `h` | Number of centuries |
| `f` | Number of half-centuries |
| `d` | Number of ducks |
| `career_yrs` | Career duration in years |
| `category` | Player category based on career runs |
| `debut_decade` | Decade of Test debut |

Some statistical fields may contain missing values where a statistic is not applicable, such as batting average for a player who was never dismissed.

## Getting Started

### 1. Download or Extract the Project

Extract the ZIP file. Open the extracted `SL-MiniProject` folder.

### 2. Run the Web Dashboard

No Python installation is required to view the dashboard.

1. Open the `SL-MiniProject` folder.
2. Double-click `Test Batting Explorer1.html`.
3. The dashboard will open in your default web browser.

Keep the HTML, CSS, JavaScript, and data files together in the same folder so that the dashboard can load its resources correctly.

### 3. Run the Python Analysis

**Requirements:**
- Python 3
- Jupyter Notebook
- Pandas
- NumPy
- Matplotlib
- Seaborn

Install the required libraries:

```bash
pip install pandas numpy matplotlib seaborn jupyter
```

Start Jupyter Notebook from the project directory:

```bash
jupyter notebook
```

Open `test_batting_analysis_simple.ipynb` and run the cells in order.

Make sure `test_batting.csv` is in the same working directory as the notebook.

## Additional Calculated Metrics

The analysis derives the following metrics:

**Runs per Match**

```text
Runs per Match = Total Runs / Matches Played
```

**Century Conversion Percentage**

```text
Century Conversion = Hundreds / (Hundreds + Fifties) × 100
```

For selected comparisons involving batting averages and rates, players with at least 1,000 career runs are considered qualified. Century conversion rankings additionally require at least 10 hundreds.

## Visualizations

The Python notebook includes:
- Bar chart of the top 10 Test run scorers.
- Bar chart of total runs by country.
- Pie chart showing countries represented among the top 10 run scorers.
- Line chart of total runs by debut decade.
- Scatter plot comparing matches played and runs.
- Histogram of batting averages for qualified players.
- Count plot of players in each career category.
- Box plot comparing batting averages by country.
- Correlation heatmap of batting statistics.

## Output

After running the notebook, the processed dataset is saved as:

```text
test_batting_clean.csv
```

The web dashboard displays its statistics and comparisons directly in the browser.

## Project Objective

The main objective of this project is to apply data analysis and visualization techniques to real-world sports statistics. It demonstrates how raw cricket data can be transformed into meaningful insights through data processing, statistical calculations, comparisons, and interactive visual presentation.

## Team Details

- **Project:** Test Batting Explorer
- **Subject:** Software Laboratory
- **Group Members:** Add group member names here
- **Section:** A5
- **Batch:** B2

## Conclusion

Test Batting Explorer provides two ways to explore Test cricket batting performance: a Python notebook for statistical analysis and a web dashboard for interactive exploration. It helps identify leading players, compare countries and generations, and understand relationships between batting statistics.

---

**Note:** The dataset included in this project covers records up to 2019 and should not be treated as a live or up-to-date cricket statistics source.
