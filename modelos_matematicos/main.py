import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def seilr(t, y, N, beta, epsilon, alpha, gamma, p):
    S, E, I, L, R = y
    dSdt = -beta * S * I / N
    dEdt = (beta * S * I / N) - (epsilon * E)
    dLdt = (1 - p) * epsilon * E - (alpha * L)
    dIdt = (p * epsilon * E) + (alpha * L) - (gamma * I)
    dRdt = gamma * I
    return [dSdt, dEdt, dIdt, dLdt, dRdt]

N = 1000 # população total
beta = 0.5 # taxa de infecção
epsilon = 0.2 # taxa de progressão exposto -> infectado
p = 0.1 # taxa de pessoas que desenvolvem a doença imediatamente
alpha = 0.02 # taxa de reativação da bactéria latente
gamma = 0.2 # taxa de reucperação
y0 = [N - 1, 0, 1, 0, 0] # S0, E0, I0, R0

t_span = (0,300)
t_eval = np.linspace(0,300,300)

solution = solve_ivp(seilr, t_span, y0, args=(N, beta, epsilon, alpha, gamma, p), t_eval=t_eval)


plt.figure(figsize = (8,5))

plt.plot(solution.t, solution.y[0], label='Suscetíveis', color='green')
plt.plot(solution.t, solution.y[1], label='Expostos', color='yellow')
plt.plot(solution.t, solution.y[2], label='Infectados', color= 'red')
plt.plot(solution.t, solution.y[3], label='Latentes', color='purple')
plt.plot(solution.t, solution.y[4], label='Recuperados', color='blue')

plt.title('Simulação SEILR')
plt.xlabel('Dias')
plt.ylabel('# de pessoas')

plt.legend()
plt.show()