<h1>How to use</h1>

<ol>
        <li>Please ensure that Node.js is installed in your computer. If not, you can download it from its <a target="_blank" href="https://nodejs.org/">official website</a>.</li>
        <li>Clone the repository: <code>git clone https://github.com/neverIand/http-arithmetic.git</code> and then <code>cd http-arithmetic</code></li>
        <li>run <code>npm install</code> under the project directory</li>
        <li>run <code>npm start</code></li>
        <li>The application is now running on port 3000.</li>
      </ol>


<h1>Request format</h1>

<h2>Base URL</h2>

<p><code>http://localhost:3000</code></p>

<h2>Endpoints for GET request</h2>

<table>
        <thead>
          <tr>
            <th>Endpoints</th>
            <th>Description</th>
            <th>Compulsory parameters</th>
            <th>URL examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>/add</td>
            <td>Returns the sum of two numbers</td>
            <td rowspan="4">number1, number2</td>
            <td>http://localhost:3000/add/1/2</td>
          </tr>
          <tr>
            <td>/subtract</td>
            <td>Returns the difference between two numbers</td>
            <td>http://localhost:3000/subtract/5/3</td>
          </tr>
          <tr>
            <td>/multiply</td>
            <td>Returns the product of two numbers</td>
            <td>http://localhost:3000/multiply/6/7</td>
          </tr>
          <tr>
            <td>/subtract</td>
            <td>Returns the quotient of two numbers <br />(number1 / number2)
            </td>
            <td>http://localhost:3000/add/1/2</td>
          </tr>
        </tbody>
      </table>

<h2>Parameters for POST request</h2>

<table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Values</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>operation</td>
            <td>add, subtract, multiply, divide</td>
            <td rowspan="2">{'operation': 'add', 'arguments': [1, 2]}</td>
          </tr>
          <tr>
            <td>arguments</td>
            <td>[number1 number2]</td>
          </tr>
        </tbody>
      </table>