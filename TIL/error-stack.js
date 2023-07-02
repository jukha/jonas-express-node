function foo() {
  bar();
}

function bar() {
  throw new Error('Something went wrong');
}

try {
  foo();
} catch (error) {
  console.log(error.stack);
}

// NOTES
/* 
In JavaScript, error.stack is a property of the Error object that contains information about the call stack when the error occurred. It provides a stack trace, which is a list of function calls that were made leading up to the point where the error was thrown.

When an error occurs in JavaScript, an Error object is typically created and thrown. This object contains properties such as name, message, and stack. The stack property is a string that represents the stack trace.


The stack trace shows the sequence of function calls, starting from the top-level code and going down to the point where the error occurred. Each line in the stack trace indicates the function name, file name (or anonymous if it's in the same file), and line number where the function was called.

The error.stack property is useful for debugging purposes as it provides valuable information about the sequence of function calls leading to the error, helping you identify the cause of the issue.
*/
