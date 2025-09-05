import tkinter as tk
import random
import time
from tkinter import messagebox, ttk

class Minesweeper:
    def __init__(self, root):
        self.root = root
        self.root.title("扫雷游戏")
        self.root.resizable(False, False)
        
        # 设置游戏参数
        self.width = 10  # 宽度
        self.height = 10  # 高度
        self.mines = 10  # 地雷数量
        
        # 游戏状态
        self.buttons = []
        self.grid = []
        self.revealed = set()
        self.flagged = set()
        self.game_over = False
        self.start_time = 0
        self.timer_running = False
        
        # 创建UI
        self.create_widgets()
        
        # 初始化游戏
        self.reset_game()
    
    def create_widgets(self):
        # 创建顶部状态栏
        self.status_frame = tk.Frame(self.root)
        self.status_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # 计时器
        self.timer_label = tk.Label(self.status_frame, text="时间: 0", font=("Arial", 12))
        self.timer_label.pack(side=tk.RIGHT, padx=5)
        
        # 剩余地雷计数器
        self.mines_left_var = tk.StringVar(value=f"剩余地雷: {self.mines}")
        self.mines_left_label = tk.Label(self.status_frame, textvariable=self.mines_left_var, font=("Arial", 12))
        self.mines_left_label.pack(side=tk.LEFT, padx=5)
        
        # 难度选择
        self.difficulty_frame = tk.Frame(self.root)
        self.difficulty_frame.pack(fill=tk.X, padx=5, pady=5)
        
        tk.Label(self.difficulty_frame, text="难度:", font=("Arial", 10)).pack(side=tk.LEFT, padx=5)
        
        self.difficulty = tk.StringVar(value="初级")
        difficulty_options = ["初级", "中级", "高级", "自定义"]
        difficulty_menu = ttk.Combobox(self.difficulty_frame, textvariable=self.difficulty, values=difficulty_options, width=8)
        difficulty_menu.pack(side=tk.LEFT, padx=5)
        difficulty_menu.bind("<<ComboboxSelected>>", self.on_difficulty_change)
        
        # 自定义按钮
        self.custom_button = tk.Button(self.difficulty_frame, text="设置", command=self.open_custom_settings)
        self.custom_button.pack(side=tk.LEFT, padx=5)
        
        # 重置按钮
        self.reset_button = tk.Button(self.status_frame, text="重置", command=self.reset_game)
        self.reset_button.pack(side=tk.LEFT, padx=5)
        
        # 创建游戏网格
        self.grid_frame = tk.Frame(self.root)
        self.grid_frame.pack(padx=5, pady=5)
    
    def on_difficulty_change(self, event=None):
        difficulty = self.difficulty.get()
        if difficulty == "初级":
            self.width = 10
            self.height = 10
            self.mines = 10
        elif difficulty == "中级":
            self.width = 16
            self.height = 16
            self.mines = 40
        elif difficulty == "高级":
            self.width = 30
            self.height = 16
            self.mines = 99
        
        if difficulty != "自定义":
            self.reset_game()
    
    def open_custom_settings(self):
        # 创建自定义设置窗口
        custom_window = tk.Toplevel(self.root)
        custom_window.title("自定义设置")
        custom_window.resizable(False, False)
        custom_window.grab_set()  # 模态窗口
        
        # 宽度设置
        tk.Label(custom_window, text="宽度: (10-30)").grid(row=0, column=0, padx=10, pady=10)
        width_var = tk.StringVar(value=str(self.width))
        tk.Entry(custom_window, textvariable=width_var, width=10).grid(row=0, column=1, padx=10, pady=10)
        
        # 高度设置
        tk.Label(custom_window, text="高度: (10-20)").grid(row=1, column=0, padx=10, pady=10)
        height_var = tk.StringVar(value=str(self.height))
        tk.Entry(custom_window, textvariable=height_var, width=10).grid(row=1, column=1, padx=10, pady=10)
        
        # 地雷数量设置
        tk.Label(custom_window, text="地雷数: (10-)").grid(row=2, column=0, padx=10, pady=10)
        mines_var = tk.StringVar(value=str(self.mines))
        tk.Entry(custom_window, textvariable=mines_var, width=10).grid(row=2, column=1, padx=10, pady=10)
        
        def apply_settings():
            try:
                width = int(width_var.get())
                height = int(height_var.get())
                mines = int(mines_var.get())
                
                # 验证输入
                if not (10 <= width <= 30 and 10 <= height <= 20):
                    messagebox.showerror("输入错误", "宽度必须在10-30之间，高度必须在10-20之间")
                    return
                
                max_mines = width * height - 1
                if not (10 <= mines <= max_mines):
                    messagebox.showerror("输入错误", f"地雷数必须在10-{max_mines}之间")
                    return
                
                # 应用设置
                self.width = width
                self.height = height
                self.mines = mines
                self.difficulty.set("自定义")
                self.reset_game()
                custom_window.destroy()
            except ValueError:
                messagebox.showerror("输入错误", "请输入有效的数字")
        
        # 应用按钮
        tk.Button(custom_window, text="应用", command=apply_settings).grid(row=3, column=0, columnspan=2, pady=10)
    
    def reset_game(self):
        # 清空游戏状态
        self.game_over = False
        self.revealed = set()
        self.flagged = set()
        self.timer_running = False
        self.timer_label.config(text="时间: 0")
        self.mines_left_var.set(f"剩余地雷: {self.mines}")
        
        # 清空并重新创建网格框架
        for widget in self.grid_frame.winfo_children():
            widget.destroy()
        
        self.buttons = []
        
        # 创建按钮网格
        for i in range(self.height):
            row = []
            for j in range(self.width):
                button = tk.Button(
                    self.grid_frame, 
                    width=2, 
                    height=1, 
                    font=("Arial", 10, "bold"),
                    bg="#d9d9d9",
                    relief=tk.RAISED
                )
                button.grid(row=i, column=j)
                button.bind("<Button-1>", lambda e, i=i, j=j: self.on_left_click(i, j))
                button.bind("<Button-3>", lambda e, i=i, j=j: self.on_right_click(i, j))
                row.append(button)
            self.buttons.append(row)
        
        # 初始化网格和地雷
        self.initialize_grid()
    
    def initialize_grid(self):
        # 创建空网格
        self.grid = [[0 for _ in range(self.width)] for _ in range(self.height)]
        
        # 随机放置地雷
        mine_positions = set()
        while len(mine_positions) < self.mines:
            i = random.randint(0, self.height - 1)
            j = random.randint(0, self.width - 1)
            mine_positions.add((i, j))
        
        # 标记地雷位置
        for i, j in mine_positions:
            self.grid[i][j] = -1  # -1 表示地雷
        
        # 计算每个格子周围的地雷数
        directions = [(-1, -1), (-1, 0), (-1, 1),
                      (0, -1),          (0, 1),
                      (1, -1),  (1, 0), (1, 1)]
        
        for i in range(self.height):
            for j in range(self.width):
                if self.grid[i][j] == -1:  # 如果是地雷，跳过
                    continue
                
                count = 0
                for di, dj in directions:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < self.height and 0 <= nj < self.width:
                        if self.grid[ni][nj] == -1:
                            count += 1
                
                self.grid[i][j] = count
    
    def on_left_click(self, i, j):
        # 如果游戏结束或格子已被揭示或标记，不做任何操作
        if self.game_over or (i, j) in self.revealed or (i, j) in self.flagged:
            return
        
        # 开始计时
        if not self.timer_running:
            self.timer_running = True
            self.start_time = time.time()
            self.update_timer()
        
        # 如果点中地雷，游戏结束
        if self.grid[i][j] == -1:
            self.reveal_mine(i, j)
            self.game_over = True
            messagebox.showinfo("游戏结束", "很遗憾，你踩到地雷了！")
            self.reveal_all()
            return
        
        # 揭示格子
        self.reveal_cell(i, j)
        
        # 检查是否胜利
        if self.check_win():
            self.game_over = True
            messagebox.showinfo("恭喜", "你赢了！")
            self.reveal_all()
    
    def on_right_click(self, i, j):
        # 如果游戏结束或格子已被揭示，不做任何操作
        if self.game_over or (i, j) in self.revealed:
            return
        
        # 开始计时
        if not self.timer_running:
            self.timer_running = True
            self.start_time = time.time()
            self.update_timer()
        
        # 标记/取消标记地雷
        if (i, j) in self.flagged:
            self.flagged.remove((i, j))
            self.buttons[i][j].config(text="", bg="#d9d9d9", relief=tk.RAISED)
        else:
            self.flagged.add((i, j))
            self.buttons[i][j].config(text="⚑", bg="#ffcccc", relief=tk.RAISED)
        
        # 更新剩余地雷数
        self.mines_left_var.set(f"剩余地雷: {self.mines - len(self.flagged)}")
    
    def reveal_cell(self, i, j):
        # 如果格子已被揭示、标记或超出边界，不做任何操作
        if (i, j) in self.revealed or (i, j) in self.flagged or \
           not (0 <= i < self.height and 0 <= j < self.width):
            return
        
        # 标记格子为已揭示
        self.revealed.add((i, j))
        button = self.buttons[i][j]
        button.config(relief=tk.SUNKEN, bg="#e6e6e6")
        
        # 根据格子的值设置显示内容
        value = self.grid[i][j]
        if value > 0:
            # 设置不同数字的颜色
            colors = ["", "blue", "green", "red", "purple", "maroon", "cyan", "black", "gray"]
            button.config(text=str(value), fg=colors[value], bg="#e6e6e6")
        
        # 如果是空格子，递归揭示周围的格子
        elif value == 0:
            directions = [(-1, -1), (-1, 0), (-1, 1),
                          (0, -1),          (0, 1),
                          (1, -1),  (1, 0), (1, 1)]
            
            for di, dj in directions:
                self.reveal_cell(i + di, j + dj)
    
    def reveal_mine(self, i, j):
        # 显示爆炸的地雷
        self.buttons[i][j].config(text="💣", bg="#ff6666")
    
    def reveal_all(self):
        # 揭示所有格子
        for i in range(self.height):
            for j in range(self.width):
                if (i, j) not in self.revealed:
                    button = self.buttons[i][j]
                    value = self.grid[i][j]
                    
                    if value == -1:  # 地雷
                        if (i, j) not in self.flagged:
                            button.config(text="💣", bg="#ff6666", relief=tk.SUNKEN)
                    else:
                        if (i, j) in self.flagged:
                            # 错误标记的格子
                            button.config(text="❌", bg="#ffcccc", relief=tk.SUNKEN)
                        else:
                            # 未揭示的安全格子
                            button.config(relief=tk.SUNKEN, bg="#e6e6e6")
                            if value > 0:
                                colors = ["", "blue", "green", "red", "purple", "maroon", "cyan", "black", "gray"]
                                button.config(text=str(value), fg=colors[value])
    
    def check_win(self):
        # 检查是否所有非地雷格子都已被揭示
        total_cells = self.width * self.height
        return len(self.revealed) == total_cells - self.mines
    
    def update_timer(self):
        # 更新计时器
        if self.timer_running and not self.game_over:
            elapsed_time = int(time.time() - self.start_time)
            self.timer_label.config(text=f"时间: {elapsed_time}")
            self.root.after(1000, self.update_timer)

if __name__ == "__main__":
    root = tk.Tk()
    game = Minesweeper(root)
    root.mainloop()