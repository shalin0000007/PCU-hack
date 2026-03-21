with open("src/app/pages/Login.tsx", "r") as f:
    text = f.read()

text = text.replace(
'''      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userRole", data.role);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials. If this is a new user, please try again to be registered.");
      }
    } catch (error) {
      console.error("Login failed", error);
      // Fallback for demo if backend is entirely unreachable
      if (formData.username === "Admin" && formData.password === "Admin@123") {
        localStorage.setItem("userRole", "admin");
        navigate("/dashboard");
      } else {
        localStorage.setItem("userRole", "user");
        navigate("/dashboard");
      }
    }''',
'''      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userRole", data.role);
        navigate("/dashboard");
      } else {
        const errData = await response.json();
        alert(errData.detail || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("System could not be reached. Please check the backend connection.")
    }'''
)

with open("src/app/pages/Login.tsx", "w") as f:
    f.write(text)
