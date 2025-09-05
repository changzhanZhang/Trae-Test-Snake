import pygame
import random
import sys

# 初始化pygame
pygame.init()

# 游戏窗口尺寸
WINDOW_WIDTH = 600
WINDOW_HEIGHT = 600
GRID_SIZE = 20
CELL_SIZE = WINDOW_WIDTH // GRID_SIZE

# 颜色定义
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
GRAY = (128, 128, 128)

# 游戏设置
FPS = 10

class Snake:
    def __init__(self):
        self.positions = [(GRID_SIZE // 2, GRID_SIZE // 2)]
        self.direction = (1, 0)
        self.grow = False
        
    def move(self):
        head_x, head_y = self.positions[0]
        dx, dy = self.direction
        new_head = ((head_x + dx) % GRID_SIZE, (head_y + dy) % GRID_SIZE)
        
        if new_head in self.positions[1:]:
            return False
            
        self.positions.insert(0, new_head)
        
        if not self.grow:
            self.positions.pop()
        else:
            self.grow = False
            
        return True
    
    def change_direction(self, new_direction):
        if (new_direction[0] * -1, new_direction[1] * -1) != self.direction:
            self.direction = new_direction
    
    def check_collision(self, food_pos):
        return self.positions[0] == food_pos
    
    def grow_snake(self):
        self.grow = True

class Food:
    def __init__(self):
        self.position = self.generate_position()
        
    def generate_position(self):
        return (random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1))
    
    def respawn(self, snake_positions):
        while True:
            new_pos = self.generate_position()
            if new_pos not in snake_positions:
                self.position = new_pos
                break

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("贪吃蛇游戏")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.reset_game()
        
    def reset_game(self):
        self.snake = Snake()
        self.food = Food()
        self.food.respawn(self.snake.positions)
        self.score = 0
        self.game_over = False
        
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            elif event.type == pygame.KEYDOWN:
                if not self.game_over:
                    if event.key == pygame.K_UP:
                        self.snake.change_direction((0, -1))
                    elif event.key == pygame.K_DOWN:
                        self.snake.change_direction((0, 1))
                    elif event.key == pygame.K_LEFT:
                        self.snake.change_direction((-1, 0))
                    elif event.key == pygame.K_RIGHT:
                        self.snake.change_direction((1, 0))
                else:
                    if event.key == pygame.K_SPACE:
                        self.reset_game()
                    elif event.key == pygame.K_ESCAPE:
                        return False
        return True
    
    def update(self):
        if not self.game_over:
            if not self.snake.move():
                self.game_over = True
                
            if self.snake.check_collision(self.food.position):
                self.snake.grow_snake()
                self.food.respawn(self.snake.positions)
                self.score += 10
    
    def draw_grid(self):
        for x in range(0, WINDOW_WIDTH, CELL_SIZE):
            pygame.draw.line(self.screen, GRAY, (x, 0), (x, WINDOW_HEIGHT))
        for y in range(0, WINDOW_HEIGHT, CELL_SIZE):
            pygame.draw.line(self.screen, GRAY, (0, y), (WINDOW_WIDTH, y))
    
    def draw(self):
        self.screen.fill(BLACK)
        self.draw_grid()
        
        # 绘制蛇
        for segment in self.snake.positions:
            rect = pygame.Rect(segment[0] * CELL_SIZE, segment[1] * CELL_SIZE, 
                             CELL_SIZE, CELL_SIZE)
            pygame.draw.rect(self.screen, GREEN, rect)
            pygame.draw.rect(self.screen, BLUE, rect, 2)
        
        # 绘制蛇头
        head = self.snake.positions[0]
        head_rect = pygame.Rect(head[0] * CELL_SIZE, head[1] * CELL_SIZE, 
                              CELL_SIZE, CELL_SIZE)
        pygame.draw.rect(self.screen, (0, 200, 0), head_rect)
        
        # 绘制食物
        food_rect = pygame.Rect(self.food.position[0] * CELL_SIZE, 
                              self.food.position[1] * CELL_SIZE, 
                              CELL_SIZE, CELL_SIZE)
        pygame.draw.rect(self.screen, RED, food_rect)
        pygame.draw.rect(self.screen, WHITE, food_rect, 2)
        
        # 绘制分数
        score_text = self.font.render(f"分数: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        if self.game_over:
            # 游戏结束界面
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            game_over_text = self.font.render("游戏结束!", True, RED)
            score_text = self.font.render(f"最终分数: {self.score}", True, WHITE)
            restart_text = self.font.render("按空格键重新开始", True, WHITE)
            exit_text = self.font.render("按ESC键退出", True, WHITE)
            
            self.screen.blit(game_over_text, 
                           (WINDOW_WIDTH // 2 - game_over_text.get_width() // 2, 
                            WINDOW_HEIGHT // 2 - 100))
            self.screen.blit(score_text, 
                           (WINDOW_WIDTH // 2 - score_text.get_width() // 2, 
                            WINDOW_HEIGHT // 2 - 50))
            self.screen.blit(restart_text, 
                           (WINDOW_WIDTH // 2 - restart_text.get_width() // 2, 
                            WINDOW_HEIGHT // 2))
            self.screen.blit(exit_text, 
                           (WINDOW_WIDTH // 2 - exit_text.get_width() // 2, 
                            WINDOW_HEIGHT // 2 + 50))
        
        pygame.display.flip()
    
    def run(self):
        running = True
        while running:
            running = self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()