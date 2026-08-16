import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def seir(t, y, N, beta, epsilon, gamma):
    S, E, I, R = y
    dSdt = -beta * S * I / N
    dEdt = (beta * S * I / N) - (epsilon * E)
    dIdt = (epsilon * E) - (gamma * I)
    dRdt = gamma * I
    return [dSdt, dEdt, dIdt, dRdt]

N = 1000 # população total
beta = 0.5 # taxa de infecção
epsilon = 0.2 # taxa de progressão exposto -> infectado
gamma = 0.2 # taxa de reucperação
y0 = [N - 1, 0, 1, 0] # S0, E0, I0, R0

t_span = (0,150)
t_eval = np.linspace(0,150,150)

solution = solve_ivp(seir, t_span, y0, args=(N, beta, epsilon, gamma), t_eval=t_eval)


plt.figure(figsize = (8,5))

plt.plot(solution.t, solution.y[0], label='Suscetíveis', color='green')
plt.plot(solution.t, solution.y[1], label='Expostos', color='yellow')
plt.plot(solution.t, solution.y[2], label='Infectados', color= 'red')
plt.plot(solution.t, solution.y[3], label='Recuperados', color='blue')

plt.title('Simulação SEIR')
plt.xlabel('Dias')
plt.ylabel('# de pessoas')

plt.legend()
plt.show()