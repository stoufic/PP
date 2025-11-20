from fpdf import FPDF

# Creating instance of FPDF class
pdf = FPDF()

# Add a page
pdf.add_page()

# Set font
pdf.set_font("Arial", size = 12)

# Adding a cell
pdf.cell(200, 10, txt = "CS3214 Spring 2025", ln = True, align = 'C')
pdf.cell(200, 10, txt = "Project 2 - 'A Fork-Join Framework'", ln = True, align = 'C')

pdf.cell(200, 10, txt = "", ln = True)  # Empty line for spacing

# Student Information
pdf.cell(200, 10, txt = "Student Information", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Toufic Saleh", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Patrick Hardy", ln = True, align = 'L')

pdf.cell(200, 10, txt = "", ln = True)  # Empty line for spacing

# How to Execute the Shell
pdf.cell(200, 10, txt = "How to Execute the Shell", ln = True, align = 'L')
pdf.cell(200, 10, txt = "To compile the thread pool implementation:", ln = True, align = 'L')
pdf.cell(200, 10, txt = "gcc -pthread threadpool.c -o threadpool", ln = True, align = 'L')
pdf.cell(200, 10, txt = "To run the program with the driver:", ln = True, align = 'L')
pdf.cell(200, 10, txt = "./fjdriver.py", ln = True, align = 'L')

pdf.cell(200, 10, txt = "", ln = True)  # Empty line for spacing

# Important Notes
pdf.cell(200, 10, txt = "Important Notes", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Ensure all dependencies are met, including a C compiler supporting C11.", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Designed for Unix-like operating systems.", ln = True, align = 'L')

pdf.cell(200, 10, txt = "", ln = True)  # Empty line for spacing

# Description of Base Functionality
pdf.cell(200, 10, txt = "Description of Base Functionality", ln = True, align = 'L')
pdf.cell(200, 10, txt = ("This thread pool implements dynamic task parallelism using a work-stealing "
                         "approach, allowing efficient execution of divide-and-conquer algorithms on multicore processors. "
                         "The basic functionalities include:"), ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Thread Pool Creation: Capable of starting up with a specified number of worker threads.", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Task Submission: Tasks can be submitted to the thread pool, which returns a future object.", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Future Handling: Futures can be used to fetch results of asynchronous task execution.", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Orderly Shutdown: Gracefully shuts down the thread pool, completing all pending tasks.", ln = True, align = 'L')

pdf.cell(200, 10, txt = "", ln = True)  # Empty line for spacing

# Description of Extended Functionality
pdf.cell(200, 10, txt = "Description of Extended Functionality", ln = True, align = 'L')
pdf.cell(200, 10, txt = ("In addition to basic functionalities, the implementation supports:"), ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Task Prioritization: Allows certain tasks to have execution priority over others.", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Exception Handling: Captures and manages exceptions within task executions to prevent crashes.", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Resource Management: Ensures minimal CPU usage when idle and optimal distribution of tasks to avoid resource starvation.", ln = True, align = 'L')

pdf.cell(200, 10, txt = "", ln = True)  # Empty line for spacing

# List of Additional Builtins Implemented
pdf.cell(200, 10, txt = "List of Additional Builtins Implemented", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Task Cancellation: Ability to cancel tasks that have not yet started.", ln = True, align = 'L')
pdf.cell(200, 10, txt = "- Concurrency Level Adjustment: Dynamic adjustment of the number of threads based on workload.", ln = True, align = 'L')

# Output the PDF to a file
pdf_output_path = 'threadpool.pdf'
pdf.output(pdf_output_path)

pdf_output_path
