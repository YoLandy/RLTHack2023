import pandas as pd


def main():
    df1 = pd.read_csv('table_berezki.csv', index_col=0, encoding='utf-8')
    df2 = pd.read_csv('table.csv', encoding='utf-8')
    output = pd.concat([df1, df2])
    print(output)


if __name__ == "__main__":
    main()
