import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def sir(t, y, N, beta, gamma):
    S, I, R = y
    dSdt = -beta * S * I / N
    dIdt = beta * S * I / N - gamma * I
    dRdt = gamma * I
    return [dSdt, dIdt, dRdt]

N = 1000 #população total
beta = 0.5 #taxa de infecção
gamma = 0.2#taxa de reucperação
y0 = [N - 1, 1, 0] #S0, I0, R0

t_span = (0,100)
t_eval = np.linspace(0,100,100)

solution = solve_ivp(sir, t_span, y0, args=(N, beta, gamma), t_eval=t_eval)


plt.figure(figsize = (8,5))

plt.plot(solution.t, solution.y[0], label='Suscetíveis', color='green')
plt.plot(solution.t, solution.y[1], label='Infectados', color= 'red')
plt.plot(solution.t, solution.y[2], label='Recuperados', color='blue')

plt.title('Simulação SIR')
plt.xlabel('Dias')
plt.ylabel('# de pessoas')

plt.legend()
plt.show()