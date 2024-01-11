module.exports = [
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./", "../"],
              message: "Relative imports are not allowed."
            }
          ]
        }
      ]
    }
  }
]
