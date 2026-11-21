import requests
from bs4 import BeautifulSoup

def decode_secret_message(url):
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")

    cells = [td.get_text(strip=True) for td in soup.find_all("td")]
    if not cells:
        print("No table data found.")
        return

    entries = []
    for i in range(0, len(cells), 3):
        try:
            x = int(cells[i])
            char = cells[i + 1]
            y = int(cells[i + 2])
            entries.append((char, x, y))
        except (IndexError, ValueError):
            continue

    if not entries:
        print("No valid entries parsed.")
        return

    max_x = max(x for _, x, _ in entries)
    max_y = max(y for _, _, y in entries)

    grid = [[" " for _ in range(max_x + 1)] for _ in range(max_y + 1)]

    for char, x, y in entries:
        grid[y][x] = char

    for row in grid:
        print("".join(row))

if __name__ == "__main__":
    decode_secret_message("https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub")
