const express = require('express'); 
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 测试根路由
app.get('/', (req, res) => {
    res.send('后端服务器已启动');
});

// 固定用户列表
const validUsers = ['user1', 'user2', 'user3'];
const chatData = {}; // 用于存储聊天记录

// 登录用户
app.post('/login', (req, res) => {
    const { username } = req.body;

    console.log('登录请求的用户名:', username); // 打印用户名

    // 检查用户是否在有效用户列表中
    if (validUsers.includes(username)) {
        return res.status(200).json({ message: '登录成功' });
    }

    return res.status(400).json({ message: '用户不存在' });
});

// 读取聊天记录
app.get('/chat/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    const chatKey1 = `${user1}_${user2}`;
    const chatKey2 = `${user2}_${user1}`; // 反向聊天记录

    // 获取聊天记录
    const messages = (chatData[chatKey1] || []).concat(chatData[chatKey2] || []);
    res.json(messages);
});

// 发送消息
app.post('/chat', (req, res) => {
    const { user1, user2, message, timestamp } = req.body; // 添加 timestamp 参数
    const chatKey = `${user1}_${user2}`;

    // 初始化聊天记录
    if (!chatData[chatKey]) {
        chatData[chatKey] = [];
    }
    // 保存消息和发送者及时间戳
    chatData[chatKey].push({ from: user1, content: message, timestamp });

    res.status(200).json({ message: '消息已保存' });
});
// 获取特定分类的项目
app.get('/projects', (req, res) => {
    const { subcategory } = req.query;
    console.log('请求的 subCategory:', subcategory); // 打印请求的 subCategory

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取项目失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            console.log('读取到的项目数据:', projectsData); // 打印读取到的项目数据

            const filteredProjects = projectsData.flatMap(user => user.projects)
                .filter(project => project.subcategory === subcategory);

            console.log('过滤后的项目:', filteredProjects); // 打印过滤后的项目
            res.json(filteredProjects);
        } catch (parseError) {
            res.status(500).json({ error: '解析项目数据失败' });
        }
    });
});


// 发布新项目
app.post('/api/projects', (req, res) => {
    const { username, projects, joinRequests, sentRequests, alert } = req.body;

    if (!username || !projects || projects.length === 0) {
        return res.status(400).json({ error: '缺少用户名或项目数据' });
    }

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取项目失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            let userProjects = projectsData.find(u => u.username === username);

            if (!userProjects) {
                userProjects = { username, projects: [], joinRequests: [], sentRequests: [], alert: [] };
                projectsData.push(userProjects);
            }

            // 为每个新项目添加 creator 字段
            const projectsWithCreator = projects.map(project => ({
                ...project,
                creator: username // 自动添加当前用户名
            }));

            // 合并新项目
            userProjects.projects = [...userProjects.projects, ...projectsWithCreator];

            fs.writeFileSync('./data/projects.json', JSON.stringify(projectsData, null, 2));
            res.status(201).json({ message: '项目发布成功', projects: projectsWithCreator });
        } catch (parseError) {
            res.status(500).json({ error: '解析项目数据失败' });
        }
    });
});


// 获取当前用户的所有项目
app.get('/api/projects/:username', (req, res) => {
    const username = req.params.username;

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取项目失败' });
        }
        try {
            const projectsData = JSON.parse(data);
            const userProjects = projectsData.find(u => u.username === username);

            if (userProjects) {
                res.json(userProjects.projects);
            } else {
                res.status(404).json({ message: '没有找到项目' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析项目数据失败' });
        }
    });
});



// 更新项目
app.put('/api/projects/:username/:id', (req, res) => {
    const { username, id } = req.params;
    const updatedProject = req.body;

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取项目失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            const userProjects = projectsData.find(u => u.username === username);

            if (userProjects) {
                const projectIndex = userProjects.projects.findIndex(proj => proj.id === Number(id));

                if (projectIndex !== -1) {
                    userProjects.projects[projectIndex] = {
                        ...userProjects.projects[projectIndex],
                        ...updatedProject,
                        creator: userProjects.projects[projectIndex].creator || username, // 保留原有 creator 或设置为当前用户名
                    };
                    fs.writeFileSync('./data/projects.json', JSON.stringify(projectsData, null, 2));
                    res.status(200).json({ message: '项目更新成功' });
                } else {
                    res.status(404).json({ error: '项目未找到' });
                }
            } else {
                res.status(404).json({ error: '未找到该用户的项目' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析项目数据失败' });
        }
    });
});


// 删除项目成员
app.put('/api/projects/removeMember/:username/:id', (req, res) => {
    const { username, id } = req.params;
    const { member } = req.body;
  
    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: '读取项目失败' });
      }
  
      try {
        const projectsData = JSON.parse(data);
        const userProjects = projectsData.find(u => u.username === username);
  
        if (userProjects) {
          const projectIndex = userProjects.projects.findIndex(proj => proj.id === Number(id));
  
          if (projectIndex !== -1) {
            const project = userProjects.projects[projectIndex];
  
            // 检查成员是否是创建者
            if (member === project.creator) {
              return res.status(403).json({ error: '无法删除项目创建者' });
            }
  
            project.members = project.members.filter(m => m !== member); // 删除成员
            fs.writeFileSync('./data/projects.json', JSON.stringify(projectsData, null, 2));
            res.status(200).json({ message: '成员删除成功' });
          } else {
            res.status(404).json({ error: '项目未找到' });
          }
        } else {
          res.status(404).json({ error: '未找到该用户的项目' });
        }
      } catch (parseError) {
        res.status(500).json({ error: '解析项目数据失败' });
      }
    });
  });
  



// 删除项目
app.delete('/api/projects/:username/:id', (req, res) => {
    const { username, id } = req.params;

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取项目失败' });
        }

        try {
            let projectsData = JSON.parse(data);
            let userProjects = projectsData.find(u => u.username === username);

            if (userProjects) {
                const originalLength = userProjects.projects.length;
                userProjects.projects = userProjects.projects.filter(proj => proj.id !== Number(id));

                if (userProjects.projects.length === originalLength) {
                    return res.status(404).json({ error: '项目未找到' });
                }

                fs.writeFileSync('./data/projects.json', JSON.stringify(projectsData, null, 2));
                res.status(200).json({ message: '项目删除成功' });
            } else {
                res.status(404).json({ error: '未找到该用户的项目' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析项目数据失败' });
        }
    });
});



// 获取特定项目详情
app.get('/api/project/:id', (req, res) => {
    const projectId = Number(req.params.id);
    console.log(`请求的项目 ID: ${projectId}`); // 打印项目ID

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('读取项目失败', err); 
            return res.status(500).json({ error: '读取项目失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            // 查找项目
            const project = projectsData.flatMap(user => user.projects).find(proj => proj.id === projectId);

            if (project) {
                console.log('找到的项目:', project); 
                res.json({
                    title: project.title,
                    num: project.num,
                    skills: project.skills,
                    content: project.content,
                    startDate: project.startDate,
                    creator: project.creator, // 发布者（创建者）
                    status: project.status  // 项目状态
                }); // 返回所需的数据
            } else {
                console.warn('未找到项目 ID:', projectId); 
                res.status(404).json({ message: '项目未找到' });
            }
        } catch (parseError) {
            console.error('解析项目数据失败', parseError); 
            res.status(500).json({ error: '解析项目数据失败' });
        }
    });
});



// 申请加入项目 
app.post('/api/project/:id/apply', (req, res) => {
    const projectId = Number(req.params.id);
    const { userId } = req.body; // 从请求体中获取用户 ID
    console.log('用户名:', userId);
    
    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取项目失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            const project = projectsData.flatMap(user => user.projects).find(proj => proj.id === projectId);
            const projectCreator = projectsData.find(user => user.projects.some(proj => proj.id === projectId));

            if (project) {
                // 检查是否是项目发起人
                if (projectCreator.username === userId) {
                    return res.status(400).json({ message: '申请失败，你是发起人。' });
                }

                // 检查项目成员是否已满
                if (project.members.length < project.num) {
                    // 检查用户是否已经申请
                    const userProjects = projectsData.find(u => u.username === userId);
                    const alreadyApplied = userProjects && userProjects.sentRequests.some(req => req.projectId === projectId && req.status === '待审核');

                    if (alreadyApplied) {
                        return res.status(400).json({ message: '您已经申请过此项目，等待审核中。' });
                    }

                    // 检查用户是否已经是项目成员
                    if (project.members.includes(userId)) {
                        return res.status(400).json({ message: '您已是该项目的成员。' });
                    }

                    // 添加申请记录到申请者的 sentRequests 中
                    if (userProjects) {
                        userProjects.sentRequests.push({
                            projectId: projectId,
                            status: '待审核'
                        });
                    } else {
                        projectsData.push({
                            username: userId,
                            sentRequests: [{
                                projectId: projectId,
                                status: '待审核'
                            }]
                        });
                    }

                    // 添加申请记录到项目创建者的 joinRequests 中
                    if (projectCreator) {
                        if (!projectCreator.joinRequests) {
                            projectCreator.joinRequests = [];
                        }
                        projectCreator.joinRequests.push({
                            projectId: projectId,
                            status: '待审核',
                            requester: userId,
                            isHandled: false // 添加 isHandled 属性
                        });
                    }

                    fs.writeFileSync('./data/projects.json', JSON.stringify(projectsData, null, 2));
                    res.status(200).json({ message: '申请加入成功，等待审核' });
                } else {
                    return res.status(400).json({ message: '项目成员已满' });
                }
            } else {
                return res.status(404).json({ message: '项目未找到' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析项目数据失败' });
        }
    });
});



// 获取当前用户的 sentRequests 及项目标题
app.get('/api/user/:username/sentRequests', (req, res) => {
    const { username } = req.params;

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取数据失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            const user = projectsData.find(u => u.username === username);

            if (user && user.sentRequests) {
                const sentRequests = user.sentRequests;

                // 获取项目标题
                const projects = projectsData.flatMap(u => u.projects);
                const requestsWithTitles = sentRequests.map(req => {
                    const project = projects.find(proj => proj.id === req.projectId);
                    return {
                        title: project ? project.title : '项目未找到',
                        status: req.status
                    };
                });

                return res.status(200).json(requestsWithTitles);
            } else {
                return res.status(404).json({ message: '用户未找到或没有申请记录' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析数据失败' });
        }
    });
});
// 获取用户的 sentRequests 及对应项目标题
app.get('/api/user/:username/sentRequests', (req, res) => {
    const { username } = req.params;

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取数据失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            const user = projectsData.find(u => u.username === username);

            if (user) {
                const sentRequestsWithTitles = user.sentRequests.map(req => {
                    const project = projectsData.flatMap(u => u.projects).find(proj => proj.id === req.projectId);
                    return {
                        title: project ? project.title : '未找到项目',
                        status: req.status
                    };
                });
                return res.status(200).json(sentRequestsWithTitles);
            } else {
                return res.status(404).json({ message: '用户未找到' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析数据失败' });
        }
    });
});

// 获取当前用户的 joinRequests 及对应项目标题和申请者
app.get('/api/user/:username/joinRequests', (req, res) => {
    const { username } = req.params;

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取数据失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            const user = projectsData.find(u => u.username === username);

            if (user) {
                const joinRequestsWithTitles = user.joinRequests.map(req => {
                    const project = projectsData.flatMap(u => u.projects).find(proj => proj.id === req.projectId);
                    return {
                        title: project ? project.title : '未找到项目',
                        status: req.status,
                        requester: req.requester,
                        projectId: req.projectId // 确保包含 projectId
                    };
                });
                
                return res.status(200).json(joinRequestsWithTitles);
            } else {
                return res.status(404).json({ message: '用户未找到' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析数据失败' });
        }
    });
});


// 同意或拒绝申请
app.put('/api/project/:id/decision', (req, res) => {
    const projectId = Number(req.params.id);
    const { username, decision, requester } = req.body; // 从请求体中获取用户名、决定和申请者

    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: '读取数据失败' });
        }

        try {
            const projectsData = JSON.parse(data);
            const user = projectsData.find(u => u.username === username);
            const project = projectsData.flatMap(u => u.projects).find(proj => proj.id === projectId);

            if (user && project) {
                // 处理 joinRequests
                const requestIndex = user.joinRequests.findIndex(req => req.projectId === projectId && req.requester === requester);
                if (requestIndex !== -1) {
                    user.joinRequests[requestIndex].status = decision === 'approve' ? '已通过' : '未通过';
                    user.joinRequests[requestIndex].isHandled = true; // 更新 isHandled 属性

                    // 更新申请者的 sentRequests 状态
                    const requesterUser = projectsData.find(u => u.username === requester);
                    if (requesterUser) {
                        const sentRequestIndex = requesterUser.sentRequests.findIndex(req => req.projectId === projectId && req.status === '待审核');
                        if (sentRequestIndex !== -1) {
                            requesterUser.sentRequests[sentRequestIndex].status = decision === 'approve' ? '已通过' : '未通过';
                        }
                    }

                    // 如果是同意，则将申请者放入项目的成员数组
                    if (decision === 'approve') {
                        if (!project.members) {
                            project.members = [];
                        }
                        project.members.push(requester); // 使用请求者
                    }

                    fs.writeFileSync('./data/projects.json', JSON.stringify(projectsData, null, 2));
                    return res.status(200).json({ message: decision === 'approve' ? '申请已通过' : '申请已拒绝' });
                } else {
                    return res.status(404).json({ message: '未找到申请记录' });
                }
            } else {
                return res.status(404).json({ message: '用户或项目未找到' });
            }
        } catch (parseError) {
            res.status(500).json({ error: '解析数据失败' });
        }
    });
});

//用户退出项目功能
app.put('/api/project/:id/leave', (req, res) => {
    const projectId = Number(req.params.id);
    const { username } = req.body;
  
    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: '读取数据失败' });
      }
  
      try {
        const projectsData = JSON.parse(data);
        const project = projectsData.flatMap(u => u.projects).find(proj => proj.id === projectId);
  
        if (project) {
          const index = project.members.indexOf(username);
          if (index > -1) {
            project.members.splice(index, 1); // 从成员数组中移除用户
            fs.writeFileSync('./data/projects.json', JSON.stringify(projectsData, null, 2));
            return res.status(200).json({ message: '退出成功' });
          } else {
            return res.status(404).json({ message: '用户未在项目中' });
          }
        } else {
          return res.status(404).json({ message: '项目未找到' });
        }
      } catch (parseError) {
        res.status(500).json({ error: '解析数据失败' });
      }
    });
  });

//获取用户参与的项目
app.get('/api/user/:username/projects', (req, res) => {
    const username = req.params.username;
  
    fs.readFile('./data/projects.json', 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: '读取数据失败' });
      }
  
      try {
        const projectsData = JSON.parse(data);
        const projects = projectsData.flatMap(user =>
          user.projects.filter(proj => proj.members.includes(username))
        );
        res.status(200).json(projects);
      } catch (parseError) {
        res.status(500).json({ error: '解析数据失败' });
      }
    });
  });
   

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 上运行`);
});
